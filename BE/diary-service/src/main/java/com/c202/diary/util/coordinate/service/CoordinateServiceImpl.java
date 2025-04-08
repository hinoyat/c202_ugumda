package com.c202.diary.util.coordinate.service;

import com.c202.diary.util.coordinate.model.CoordinateDto;
import com.c202.diary.diary.entity.Diary;
import com.c202.diary.diary.repository.DiaryRepository;
import com.c202.diary.emotion.entity.Emotion;
import com.c202.diary.emotion.repository.EmotionRepository;
import com.c202.diary.tag.entity.DiaryTag;
import com.c202.diary.tag.repository.DiaryTagRepository;
import com.c202.exception.types.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 일기의 3D 좌표 생성 및 관리를 담당하는 서비스
 * 별자리 형태의 좌표 생성과 연결 관계 설정을 통합 관리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CoordinateServiceImpl implements CoordinateService {

    private final EmotionRepository emotionRepository;
    private final DiaryRepository diaryRepository;
    private final DiaryTagRepository diaryTagRepository;
    private final ConstellationLayoutService layoutService;
    private final ConstellationConnectionService connectionService;

    // 결과 캐싱을 위한 맵 (사용자별 마지막 계산 결과)
    private final Map<Integer, Map<Integer, List<Integer>>> userConnectionCache = new HashMap<>();
    private final Map<Integer, Long> userConnectionCacheTimestamp = new HashMap<>();

    // 캐시 유효 시간 (5분)
    private static final long CACHE_VALIDITY_MS = 5 * 60 * 1000;

    /**
     * 새 일기를 위한 좌표를 생성합니다.
     * 감정 영역과 태그 유사성에 기반하여 별자리 패턴에 맞는 좌표를 생성합니다.
     *
     * @param mainEmotion 주요 감정 이름
     * @param tags 태그 목록
     * @param diarySeq 일기 시퀀스 (새 일기라면 null)
     * @return 생성된 좌표 정보
     */
    @Override
    public CoordinateDto generateCoordinates(String mainEmotion, List<String> tags, Integer diarySeq) {
        // 1. 감정 정보 조회
        Emotion emotion = emotionRepository.findByName(mainEmotion)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 감정입니다: " + mainEmotion));

        // 2. 같은 감정의 다른 일기들 조회
        List<Diary> sameCategoryDiaries = diaryRepository.findAll().stream()
                .filter(d -> !d.getIsDeleted().equals("Y"))
                .filter(d -> d.getDiarySeq() != null && (diarySeq == null || !d.getDiarySeq().equals(diarySeq)))
                .filter(d -> d.getEmotionSeq() != null && d.getEmotionSeq().equals(emotion.getEmotionSeq()))
                .collect(Collectors.toList());

        // 3. 최적의 위치 결정
        double[] coordinates;

        if (sameCategoryDiaries.isEmpty()) {
            // 같은 감정의 다른 일기가 없으면 감정 영역 내 랜덤한 위치
            coordinates = generateRandomPositionInEmotion(emotion);
        } else {
            // 유사한 일기들이 있다면 적절한 별자리 패턴 내 위치 결정
            coordinates = findOptimalPosition(emotion, sameCategoryDiaries, tags);
        }

        log.info("새 일기 좌표 생성 완료: emotion={}, x={}, y={}, z={}",
                mainEmotion, coordinates[0], coordinates[1], coordinates[2]);

        return CoordinateDto.builder()
                .x(coordinates[0])
                .y(coordinates[1])
                .z(coordinates[2])
                .emotionSeq(emotion.getEmotionSeq())
                .emotionName(emotion.getName())
                .build();
    }

    /**
     * 기존 일기의 좌표를 업데이트합니다.
     * 태그나 감정이 변경된 경우 새 위치를 계산합니다.
     *
     * @param diary 업데이트할 일기
     * @param mainEmotion 주요 감정 이름
     * @param tags 태그 목록
     * @return 업데이트된 좌표 정보
     */
    @Override
    public CoordinateDto updateCoordinates(Diary diary, String mainEmotion, List<String> tags) {
        // 1. 감정 변경 여부 확인
        Emotion currentEmotion = diary.getEmotionSeq() != null ?
                emotionRepository.findById(diary.getEmotionSeq())
                        .orElse(null) : null;

        Emotion targetEmotion = emotionRepository.findByName(mainEmotion)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 감정입니다: " + mainEmotion));

        // 2. 감정이 변경된 경우 새 좌표 생성
        if (currentEmotion == null || !currentEmotion.getEmotionSeq().equals(targetEmotion.getEmotionSeq())) {
            log.info("감정이 변경되어 새 좌표 생성: diary={}, oldEmotion={}, newEmotion={}",
                    diary.getDiarySeq(),
                    currentEmotion != null ? currentEmotion.getName() : "없음",
                    mainEmotion);

            return generateCoordinates(mainEmotion, tags, diary.getDiarySeq());
        }

        // 3. 동일 감정 내 위치 조정 (태그가 변경된 경우)
        List<String> currentTags = getDiaryTags(diary);
        boolean tagsChanged = !areSameTagLists(currentTags, tags);

        if (tagsChanged) {
            log.info("태그가 변경되어 좌표 조정: diary={}, emotion={}", diary.getDiarySeq(), mainEmotion);

            // 유사한 일기들과 함께 별자리 패턴 위치 조정
            List<Diary> sameCategoryDiaries = diaryRepository.findAll().stream()
                    .filter(d -> !d.getIsDeleted().equals("Y"))
                    .filter(d -> !d.getDiarySeq().equals(diary.getDiarySeq()))
                    .filter(d -> d.getEmotionSeq() != null && d.getEmotionSeq().equals(targetEmotion.getEmotionSeq()))
                    .collect(Collectors.toList());

            double[] coordinates = findOptimalPosition(targetEmotion, sameCategoryDiaries, tags);

            return CoordinateDto.builder()
                    .x(coordinates[0])
                    .y(coordinates[1])
                    .z(coordinates[2])
                    .emotionSeq(targetEmotion.getEmotionSeq())
                    .emotionName(targetEmotion.getName())
                    .build();
        }

        // 태그도 감정도 변경되지 않았으면 기존 좌표 유지
        log.info("좌표 변경 없음: diary={}, emotion={}", diary.getDiarySeq(), mainEmotion);

        return CoordinateDto.builder()
                .x(diary.getX())
                .y(diary.getY())
                .z(diary.getZ())
                .emotionSeq(targetEmotion.getEmotionSeq())
                .emotionName(targetEmotion.getName())
                .build();
    }

    /**
     * 현재 일기와 유사한 다른 일기들을 찾습니다.
     * 태그 유사도와 감정에 기반하여 가장 관련있는 일기들을 반환합니다.
     *
     * @param diarySeq 기준 일기 시퀀스
     * @param maxResults 반환할 최대 결과 수
     * @return 유사한 일기 시퀀스 목록
     */
    @Override
    public List<Integer> findSimilarDiaries(Integer diarySeq, int maxResults) {
        // 1. 일기 조회
        Diary diary = diaryRepository.findByDiarySeq(diarySeq)
                .orElseThrow(() -> new NotFoundException("일기를 찾을 수 없습니다: " + diarySeq));

        // 캐시 확인
        Integer userSeq = diary.getUserSeq();
        if (userConnectionCache.containsKey(userSeq)) {
            long lastUpdateTime = userConnectionCacheTimestamp.getOrDefault(userSeq, 0L);
            long currentTime = System.currentTimeMillis();

            // 캐시가 유효하면 캐시된 결과 사용
            if (currentTime - lastUpdateTime < CACHE_VALIDITY_MS) {
                Map<Integer, List<Integer>> connections = userConnectionCache.get(userSeq);
                if (connections.containsKey(diarySeq)) {
                    List<Integer> result = connections.get(diarySeq);
                    return result.stream().limit(maxResults).collect(Collectors.toList());
                }
            }
        }

        // 2. 같은 사용자, 같은 감정의 다른 일기들 조회
        List<Diary> candidateDiaries = diaryRepository.findByUserSeqAndIsDeleted(diary.getUserSeq(), "N").stream()
                .filter(d -> !d.getIsDeleted().equals("Y"))
                .filter(d -> !d.getDiarySeq().equals(diarySeq))
                .filter(d -> Objects.equals(d.getEmotionSeq(), diary.getEmotionSeq()))
                .collect(Collectors.toList());

        if (candidateDiaries.isEmpty()) {
            return Collections.emptyList();
        }

        // 3. 태그 기반 유사도 계산
        List<String> diaryTags = getDiaryTags(diary);
        List<DiaryWithSimilarity> similarities = new ArrayList<>();

        for (Diary other : candidateDiaries) {
            List<String> otherTags = getDiaryTags(other);
            double similarity = calculateTagSimilarity(diaryTags, otherTags);
            similarities.add(new DiaryWithSimilarity(other, similarity));
        }

        // 유사도 기준 내림차순 정렬
        similarities.sort(Comparator.comparing(DiaryWithSimilarity::getSimilarity).reversed());

        // 가장 유사한 일기들 선택
        return similarities.stream()
                .limit(maxResults)
                .map(sim -> sim.getDiary().getDiarySeq())
                .collect(Collectors.toList());
    }

    /**
     * 사용자의 모든 일기를 재배치합니다.
     * 별자리 패턴에 맞게 감정별로 일기들을 재배치하고 연결 관계를 최적화합니다.
     *
     * @param userSeq 사용자 시퀀스
     * @return 일기 간 연결 관계 맵
     */
    @Override
    public Map<Integer, List<Integer>> relayoutUniverse(Integer userSeq) {
        log.info("사용자 {} 우주 별자리 형태 재배치 시작", userSeq);

        // 1. 사용자의 모든 일기 조회
        List<Diary> diaries = diaryRepository.findByUserSeqAndIsDeleted(userSeq, "N")
                .stream()
                .filter(d -> d.getEmotionSeq() != null) // 감정이 있는 일기만 처리
                .collect(Collectors.toList());

        if (diaries.isEmpty()) {
            log.info("재배치할 일기가 없습니다. 사용자: {}", userSeq);
            return new HashMap<>();
        }

        // 2. 감정별로 일기 그룹화
        Map<Integer, List<Diary>> diariesByEmotion = diaries.stream()
                .collect(Collectors.groupingBy(Diary::getEmotionSeq));

        // 3. 전체 연결 관계 맵
        Map<Integer, List<Integer>> allConnections = new HashMap<>();

        // 4. 각 감정별로 처리
        for (Map.Entry<Integer, List<Diary>> entry : diariesByEmotion.entrySet()) {
            Integer emotionSeq = entry.getKey();
            List<Diary> emotionDiaries = entry.getValue();

            // 감정 정보 조회
            Emotion emotion = emotionRepository.findById(emotionSeq)
                    .orElseThrow(() -> new NotFoundException("감정을 찾을 수 없습니다: " + emotionSeq));

            // 감정별 일기 그룹화
            List<List<Diary>> constellationGroups = groupDiariesIntoConstellations(emotionDiaries);

            // 별자리 좌표 생성 및 적용
            Map<Integer, double[][]> constellationCoordinates =
                    layoutService.generateMultipleConstellations(emotion, constellationGroups);

            // 좌표 적용
            applyCoordinatesToDiaries(constellationGroups, constellationCoordinates);

            // 연결 관계 최적화
            Map<Integer, List<Integer>> emotionConnections =
                    connectionService.optimizeConstellationConnections(constellationGroups);

            // 전체 연결 관계에 추가
            allConnections.putAll(emotionConnections);
        }

        // 5. 변경된 일기 저장
        diaryRepository.saveAll(diaries);

        // 6. 연결 관계 캐싱
        userConnectionCache.put(userSeq, allConnections);
        userConnectionCacheTimestamp.put(userSeq, System.currentTimeMillis());

        log.info("사용자 {} 우주 별자리 형태 재배치 완료. 일기 수: {}, 연결 수: {}",
                userSeq, diaries.size(), allConnections.values().stream().mapToInt(List::size).sum() / 2);

        return allConnections;
    }

    /**
     * 감정 영역 내 랜덤한 위치를 생성합니다.
     */
    private double[] generateRandomPositionInEmotion(Emotion emotion) {
        double[] position = new double[3];

        Random random = new Random();

        // 감정 중심으로부터의 거리 (0.2~0.8 범위)
        double distance = emotion.getBaseRadius() * (0.2 + 0.6 * random.nextDouble());

        // 구면 좌표 생성
        double theta = random.nextDouble() * 2 * Math.PI; // 방위각
        double phi = random.nextDouble() * Math.PI; // 극각

        // 구면 좌표를 직교 좌표로 변환
        position[0] = emotion.getBaseX() + distance * Math.sin(phi) * Math.cos(theta);
        position[1] = emotion.getBaseY() + distance * Math.sin(phi) * Math.sin(theta);
        position[2] = emotion.getBaseZ() + distance * Math.cos(phi);

        return position;
    }

    /**
     * 태그와 감정에 기반하여 최적의 위치를 결정합니다.
     */
    private double[] findOptimalPosition(Emotion emotion, List<Diary> sameCategoryDiaries, List<String> tags) {
        // 태그 유사도에 따라 일기 그룹화
        List<List<Diary>> groups = groupDiariesByTagSimilarity(sameCategoryDiaries);

        // 가장 유사한 그룹 찾기
        List<Diary> bestGroup = findMostSimilarGroup(groups, tags);

        // 태그 유사도가 높은 그룹이 없으면 새 위치 생성
        if (bestGroup == null || bestGroup.isEmpty()) {
            return generateRandomPositionInEmotion(emotion);
        }

        // 유사한 그룹이 있으면 그룹에 맞는 별자리 패턴 위치 생성
        bestGroup = new ArrayList<>(bestGroup); // 복사본 생성 (원본 수정 방지)

        // 임시 일기 객체를 추가 (새 위치 계산용)
        Diary tempDiary = Diary.builder()
                .diarySeq(-1) // 임시 ID
                .emotionSeq(emotion.getEmotionSeq())
                .build();
        bestGroup.add(tempDiary);

        // 별자리 패턴 좌표 생성
        double[][] coordinates = layoutService.generateConstellationLayout(emotion, bestGroup);

        // 새 일기 위치 (마지막 인덱스)
        return coordinates[coordinates.length - 1];
    }

    /**
     * 태그 유사도에 따라 일기들을 그룹화합니다.
     */
    private List<List<Diary>> groupDiariesByTagSimilarity(List<Diary> diaries) {
        // 최대 그룹 크기
        final int MAX_GROUP_SIZE = 7;

        // 결과 그룹 목록
        List<List<Diary>> groups = new ArrayList<>();

        // 처리 완료된 일기 집합
        Set<Integer> processed = new HashSet<>();

        // 각 일기에 대해
        for (Diary diary : diaries) {
            if (processed.contains(diary.getDiarySeq())) {
                continue;
            }

            // 새 그룹 시작
            List<Diary> group = new ArrayList<>();
            group.add(diary);
            processed.add(diary.getDiarySeq());

            // 이 일기의 태그
            List<String> diaryTags = getDiaryTags(diary);

            // 이 일기와 가장 유사한 다른 일기들 찾기
            List<DiaryWithSimilarity> similarities = new ArrayList<>();
            for (Diary other : diaries) {
                if (processed.contains(other.getDiarySeq())) {
                    continue;
                }

                List<String> otherTags = getDiaryTags(other);
                double similarity = calculateTagSimilarity(diaryTags, otherTags);

                if (similarity > 0.25) { // 유사도 임계값
                    similarities.add(new DiaryWithSimilarity(other, similarity));
                }
            }

            // 유사도 순으로 정렬
            similarities.sort(Comparator.comparing(DiaryWithSimilarity::getSimilarity).reversed());

            // 최대 크기까지 그룹에 추가
            for (DiaryWithSimilarity sim : similarities) {
                if (group.size() >= MAX_GROUP_SIZE) {
                    break;
                }
                group.add(sim.getDiary());
                processed.add(sim.getDiary().getDiarySeq());
            }

            groups.add(group);
        }

        return groups;
    }

    /**
     * 주어진 태그와 가장 유사한 일기 그룹을 찾습니다.
     */
    private List<Diary> findMostSimilarGroup(List<List<Diary>> groups, List<String> tags) {
        if (groups.isEmpty() || tags == null || tags.isEmpty()) {
            return groups.isEmpty() ? null : groups.get(0);
        }

        List<Diary> bestGroup = null;
        double highestSimilarity = -1;

        for (List<Diary> group : groups) {
            // 그룹의 모든 태그 수집
            Set<String> groupTags = new HashSet<>();
            for (Diary diary : group) {
                groupTags.addAll(getDiaryTags(diary));
            }

            // 유사도 계산
            double similarity = calculateTagSimilarity(
                    new ArrayList<>(groupTags),
                    tags
            );

            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestGroup = group;
            }
        }

        return bestGroup;
    }

    /**
     * 별자리 패턴에 따라 일기들을 그룹화합니다.
     */
    private List<List<Diary>> groupDiariesIntoConstellations(List<Diary> diaries) {
        // 최대/최소 그룹 크기
        final int MAX_GROUP_SIZE = 7;
        final int MIN_GROUP_SIZE = 2;

        // 태그 유사도로 초기 그룹화
        List<List<Diary>> groups = groupDiariesByTagSimilarity(diaries);

        // 너무 작은 그룹 병합
        List<List<Diary>> finalGroups = new ArrayList<>();
        List<Diary> leftovers = new ArrayList<>();

        for (List<Diary> group : groups) {
            if (group.size() >= MIN_GROUP_SIZE) {
                finalGroups.add(group);
            } else {
                leftovers.addAll(group);
            }
        }

        // 남은 일기들을 기존 그룹에 분배
        if (!leftovers.isEmpty()) {
            if (finalGroups.isEmpty()) {
                // 모든 그룹이 너무 작으면 하나의 그룹으로 합침
                finalGroups.add(leftovers);
            } else {
                // 작은 그룹의 일기들을 기존 그룹에 분배
                for (Diary leftover : leftovers) {
                    // 가장 작은 그룹 찾기
                    List<Diary> smallestGroup = finalGroups.stream()
                            .min(Comparator.comparing(List::size))
                            .orElse(finalGroups.get(0));

                    if (smallestGroup.size() < MAX_GROUP_SIZE) {
                        smallestGroup.add(leftover);
                    } else {
                        // 모든 그룹이 가득 찼으면 새 그룹 생성
                        List<Diary> newGroup = new ArrayList<>();
                        newGroup.add(leftover);
                        finalGroups.add(newGroup);
                    }
                }
            }
        }

        return finalGroups;
    }

    /**
     * 좌표를 일기들에 적용합니다.
     */
    private void applyCoordinatesToDiaries(
            List<List<Diary>> constellationGroups,
            Map<Integer, double[][]> constellationCoordinates) {

        for (List<Diary> group : constellationGroups) {
            if (group.isEmpty()) {
                continue;
            }

            int groupKey = group.get(0).getDiarySeq();
            double[][] coordinates = constellationCoordinates.get(groupKey);

            if (coordinates == null || coordinates.length < group.size()) {
                log.warn("좌표 배열이 없거나 크기가 부족합니다. 그룹: {}, 좌표: {}",
                        groupKey, coordinates != null ? coordinates.length : "null");
                continue;
            }

            // 각 일기에 좌표 적용
            for (int i = 0; i < group.size(); i++) {
                Diary diary = group.get(i);
                diary.setCoordinates(
                        coordinates[i][0],
                        coordinates[i][1],
                        coordinates[i][2],
                        diary.getEmotionSeq()
                );
            }
        }
    }

    /**
     * 일기의 태그 목록을 조회합니다.
     */
    private List<String> getDiaryTags(Diary diary) {
        List<DiaryTag> diaryTags = diaryTagRepository.findByDiary(diary);
        return diaryTags.stream()
                .map(diaryTag -> diaryTag.getTag().getName())
                .collect(Collectors.toList());
    }

    /**
     * 두 태그 목록이 동일한지 확인합니다.
     */
    private boolean areSameTagLists(List<String> tags1, List<String> tags2) {
        if (tags1 == null && tags2 == null) {
            return true;
        }
        if (tags1 == null || tags2 == null) {
            return false;
        }
        if (tags1.size() != tags2.size()) {
            return false;
        }

        Set<String> set1 = new HashSet<>(tags1);
        Set<String> set2 = new HashSet<>(tags2);
        return set1.equals(set2);
    }

    /**
     * 두 태그 목록 간의 자카드 유사도를 계산합니다.
     */
    private double calculateTagSimilarity(List<String> tags1, List<String> tags2) {
        if (tags1.isEmpty() && tags2.isEmpty()) {
            return 0.0;
        }

        if (tags1.isEmpty() || tags2.isEmpty()) {
            return 0.1; // 기본 유사도
        }

        Set<String> union = new HashSet<>(tags1);
        union.addAll(tags2);

        Set<String> intersection = new HashSet<>(tags1);
        intersection.retainAll(tags2);

        return (double) intersection.size() / union.size();
    }

    /**
     * 내부 클래스: 일기와 유사도 정보
     */
    private static class DiaryWithSimilarity {
        private final Diary diary;
        private final double similarity;

        public DiaryWithSimilarity(Diary diary, double similarity) {
            this.diary = diary;
            this.similarity = similarity;
        }

        public Diary getDiary() {
            return diary;
        }

        public double getSimilarity() {
            return similarity;
        }
    }
}
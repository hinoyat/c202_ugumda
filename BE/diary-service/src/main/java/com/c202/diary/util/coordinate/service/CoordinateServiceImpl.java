package com.c202.diary.util.coordinate.service;

import com.c202.diary.util.coordinate.model.ClusterDto;
import com.c202.diary.util.coordinate.model.CoordinateDto;
import com.c202.diary.diary.entity.Diary;
import com.c202.diary.diary.repository.DiaryRepository;
import com.c202.diary.emotion.entity.Emotion;
import com.c202.diary.emotion.repository.EmotionRepository;
import com.c202.exception.types.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CoordinateServiceImpl implements CoordinateService {

    private final EmotionRepository emotionRepository;
    private final DiaryRepository diaryRepository;
    private final ClusteringService clusteringService;
    private final CoordinateGenerator coordinateGenerator;
    private final MSTService mstService;

    @Override
    public CoordinateDto generateCoordinates(String mainEmotion, List<String> tags, Integer diarySeq) {
        // 1. 감정 영역 정보 가져오기
        Emotion emotion = emotionRepository.findByName(mainEmotion)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 감정입니다: " + mainEmotion));

        // 2. 감정 영역 내 일기 목록 조회
        List<Diary> emotionDiaries = diaryRepository.findAll().stream()
                .filter(d -> !d.getIsDeleted().equals("Y"))
                .filter(d -> d.getEmotionSeq() != null && d.getEmotionSeq().equals(emotion.getEmotionSeq()))
                .collect(Collectors.toList());

        if (diarySeq != null) {
            emotionDiaries = emotionDiaries.stream()
                    .filter(d -> !d.getDiarySeq().equals(diarySeq))
                    .collect(Collectors.toList());
        }

        // 3. 감정 영역 내 클러스터 형성
        List<ClusterDto> clusters = clusteringService.formClusters(emotionDiaries, tags);

        // 4. 최적의 클러스터 선택 또는 새 클러스터 생성
        ClusterDto targetCluster;
        if (clusters.isEmpty()) {
            targetCluster = clusteringService.createNewCluster(emotion);
        } else {
            targetCluster = clusteringService.findBestCluster(clusters, tags);
        }

        // 5. 클러스터 내에서 좌표 생성
        double[] coordinates = coordinateGenerator.generateCoordinatesInCluster(targetCluster, emotion);

        // 6. 충돌 방지 및 좌표 조정
        List<double[]> existingCoordinates = emotionDiaries.stream()
                .map(d -> new double[]{d.getX(), d.getY(), d.getZ()})
                .collect(Collectors.toList());
        coordinates = coordinateGenerator.adjustCoordinates(coordinates, existingCoordinates);

        return CoordinateDto.builder()
                .x(coordinates[0])
                .y(coordinates[1])
                .z(coordinates[2])
                .emotionSeq(emotion.getEmotionSeq())
                .emotionName(emotion.getName())
                .distance(coordinateGenerator.calculateDistance(
                        emotion.getBaseX(), emotion.getBaseY(), emotion.getBaseZ(),
                        coordinates[0], coordinates[1], coordinates[2]
                ))
                .build();
    }

    @Override
    public CoordinateDto updateCoordinates(Diary diary, String mainEmotion, List<String> tags) {
        Emotion currentEmotion = emotionRepository.findByEmotionSeq(diary.getEmotionSeq())
                .orElse(null);
        Emotion targetEmotion = emotionRepository.findByName(mainEmotion)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 감정입니다: " + mainEmotion));

        if (currentEmotion == null || !currentEmotion.getName().equals(mainEmotion)) {
            return generateCoordinates(mainEmotion, tags, diary.getDiarySeq());
        }

        List<Diary> emotionDiaries = diaryRepository.findAll().stream()
                .filter(d -> !d.getIsDeleted().equals("Y"))
                .filter(d -> !d.getDiarySeq().equals(diary.getDiarySeq()))
                .filter(d -> d.getEmotionSeq() != null && d.getEmotionSeq().equals(targetEmotion.getEmotionSeq()))
                .collect(Collectors.toList());

        List<ClusterDto> clusters = clusteringService.formClusters(emotionDiaries, tags);

        ClusterDto targetCluster;
        if (clusters.isEmpty()) {
            targetCluster = new ClusterDto();
            targetCluster.setCenterX(diary.getX());
            targetCluster.setCenterY(diary.getY());
            targetCluster.setCenterZ(diary.getZ());
        } else {
            targetCluster = clusteringService.findBestCluster(clusters, tags);
        }

        double adjustmentFactor = 0.2;
        double distToClusterCenter = coordinateGenerator.calculateDistance(
                diary.getX(), diary.getY(), diary.getZ(),
                targetCluster.getCenterX(), targetCluster.getCenterY(), targetCluster.getCenterZ()
        );

        double[] newCoordinates = new double[3];
        if (distToClusterCenter > 0) {
            double dirX = (targetCluster.getCenterX() - diary.getX()) / distToClusterCenter;
            double dirY = (targetCluster.getCenterY() - diary.getY()) / distToClusterCenter;
            double dirZ = (targetCluster.getCenterZ() - diary.getZ()) / distToClusterCenter;
            double moveDistance = distToClusterCenter * adjustmentFactor;
            newCoordinates[0] = diary.getX() + dirX * moveDistance;
            newCoordinates[1] = diary.getY() + dirY * moveDistance;
            newCoordinates[2] = diary.getZ() + dirZ * moveDistance;
        } else {
            double randomOffset = 5.0;
            newCoordinates[0] = diary.getX() + (new Random().nextDouble() - 0.5) * 2 * randomOffset;
            newCoordinates[1] = diary.getY() + (new Random().nextDouble() - 0.5) * 2 * randomOffset;
            newCoordinates[2] = diary.getZ() + (new Random().nextDouble() - 0.5) * 2 * randomOffset;
        }

        double distanceFromEmotionCenter = coordinateGenerator.calculateDistance(
                targetEmotion.getBaseX(), targetEmotion.getBaseY(), targetEmotion.getBaseZ(),
                newCoordinates[0], newCoordinates[1], newCoordinates[2]
        );
        if (distanceFromEmotionCenter > targetEmotion.getBaseRadius()) {
            double scale = targetEmotion.getBaseRadius() / distanceFromEmotionCenter * 0.95;
            newCoordinates[0] = targetEmotion.getBaseX() + (newCoordinates[0] - targetEmotion.getBaseX()) * scale;
            newCoordinates[1] = targetEmotion.getBaseY() + (newCoordinates[1] - targetEmotion.getBaseY()) * scale;
            newCoordinates[2] = targetEmotion.getBaseZ() + (newCoordinates[2] - targetEmotion.getBaseZ()) * scale;
        }

        List<double[]> existingCoordinates = emotionDiaries.stream()
                .map(d -> new double[]{d.getX(), d.getY(), d.getZ()})
                .collect(Collectors.toList());
        newCoordinates = coordinateGenerator.adjustCoordinates(newCoordinates, existingCoordinates);

        return CoordinateDto.builder()
                .x(newCoordinates[0])
                .y(newCoordinates[1])
                .z(newCoordinates[2])
                .emotionSeq(targetEmotion.getEmotionSeq())
                .emotionName(targetEmotion.getName())
                .distance(coordinateGenerator.calculateDistance(
                        targetEmotion.getBaseX(), targetEmotion.getBaseY(), targetEmotion.getBaseZ(),
                        newCoordinates[0], newCoordinates[1], newCoordinates[2]
                ))
                .build();
    }

    @Override
    public List<Integer> findSimilarDiaries(Integer diarySeq, int maxResults) {
        Diary diary = diaryRepository.findByDiarySeq(diarySeq)
                .orElseThrow(() -> new NotFoundException("일기를 찾을 수 없습니다: " + diarySeq));

        List<String> diaryTags = clusteringService.getDiaryTags(diary);

        List<Diary> sameCategoryDiaries = diaryRepository.findByUserSeqAndIsDeleted(diary.getUserSeq(), "N").stream()
                .filter(d -> !d.getIsDeleted().equals("Y"))
                .filter(d -> !d.getDiarySeq().equals(diarySeq))
                .filter(d -> Objects.equals(d.getEmotionSeq(), diary.getEmotionSeq()))
                .collect(Collectors.toList());

        Map<Integer, List<Integer>> mst = mstService.calculateMST(diary, sameCategoryDiaries);
        if (mst.containsKey(diarySeq)) {
            List<Integer> connections = mst.get(diarySeq);
            if (connections.size() <= maxResults) {
                return connections;
            }
            // 유사도가 높은 순으로 정렬하여 제한 개수만 반환
            Map<Integer, Double> similarityScores = new HashMap<>();
            for (Integer connectedDiarySeq : connections) {
                Diary connectedDiary = sameCategoryDiaries.stream()
                        .filter(d -> d.getDiarySeq().equals(connectedDiarySeq))
                        .findFirst()
                        .orElse(null);
                if (connectedDiary != null) {
                    List<String> connectedTags = clusteringService.getDiaryTags(connectedDiary);
                    similarityScores.put(connectedDiarySeq,
                            clusteringService.calculateTagSimilarity(diaryTags, connectedTags));
                }
            }
            return similarityScores.entrySet().stream()
                    .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                    .limit(maxResults)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
        }

        Map<Integer, Double> similarityScores = new HashMap<>();
        for (Diary otherDiary : sameCategoryDiaries) {
            List<String> otherTags = clusteringService.getDiaryTags(otherDiary);
            similarityScores.put(otherDiary.getDiarySeq(),
                    clusteringService.calculateTagSimilarity(diaryTags, otherTags));
        }
        return similarityScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(maxResults)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}

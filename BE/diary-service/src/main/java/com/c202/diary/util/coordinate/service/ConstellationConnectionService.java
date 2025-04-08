package com.c202.diary.util.coordinate.service;

import com.c202.diary.diary.entity.Diary;
import com.c202.diary.tag.entity.DiaryTag;
import com.c202.diary.tag.repository.DiaryTagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 별자리 연결 관계를 생성하고 최적화하는 서비스
 * 일기 간의 태그 유사도를 기반으로 최적의 연결 관계를 만들어 별자리처럼 보이도록 합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConstellationConnectionService {

    private final DiaryTagRepository diaryTagRepository;

    // 일기별 최대 연결 수 (시각적으로 복잡해지지 않도록 제한)
    private static final int MAX_CONNECTIONS_PER_DIARY = 1;

    // 최소 연결 유사도 임계값 (이 값 이상의 유사도를 가진 일기만 연결)
    private static final double MIN_SIMILARITY_THRESHOLD = 0.45;

    /**
     * 일기 목록에서 최적의 연결 관계를 생성합니다.
     *
     * @param diaries 일기 목록
     * @return 일기 ID를 키로, 연결된 일기 ID 목록을 값으로 하는 맵
     */
    public Map<Integer, List<Integer>> optimizeConnections(List<Diary> diaries) {
        Map<Integer, List<Integer>> connections = new HashMap<>();

        // 각 일기에 빈 연결 목록 초기화
        for (Diary diary : diaries) {
            connections.put(diary.getDiarySeq(), new ArrayList<>());
        }

        // 일기가 1개 이하면 연결이 필요 없음
        if (diaries.size() <= 1) {
            return connections;
        }

        // 감정에 맞는 별자리 패턴으로 연결
        String emotionName = "기본";
        // 모든 일기가 같은 감정을 가지고 있다고 가정
        if (diaries.get(0).getEmotionSeq() != null) {
            // 실제 애플리케이션에서는 emotion 엔티티를 조회해야 함
            // emotionName = emotionRepository.findById(diaries.get(0).getEmotionSeq()).getName();
            // 여기서는 시각적 패턴을 선택하기 위한 값으로만 사용
        }

        // 일기 수에 따라 적절한 연결 패턴 적용
        if (diaries.size() <= 3) {
            applySimpleConnections(diaries, connections);
        } else if (diaries.size() <= 5) {
            applyMediumConnections(diaries, connections, emotionName);
        } else {
            applyLargeConnections(diaries, connections, emotionName);
        }

        return connections;
    }

    /**
     * 별자리 그룹 내에서 연결 관계를 최적화합니다.
     *
     * @param constellationGroups 별자리 그룹 목록
     * @return 최적화된 연결 관계
     */
    public Map<Integer, List<Integer>> optimizeConstellationConnections(List<List<Diary>> constellationGroups) {
        Map<Integer, List<Integer>> connections = new HashMap<>();

        // 모든 일기 수집 및 초기화
        for (List<Diary> group : constellationGroups) {
            for (Diary diary : group) {
                connections.put(diary.getDiarySeq(), new ArrayList<>());
            }
        }

        // 각 별자리 그룹 내부에 형태 적용
        for (List<Diary> group : constellationGroups) {
            // 그룹 내 일기 수에 따라 다른 패턴 적용
            if (group.size() <= 3) {
                applySimpleConnections(group, connections);
            } else if (group.size() <= 5) {
                // 그룹의 감정에 따라 패턴 선택
                String emotionName = "기본";
                if (group.get(0).getEmotionSeq() != null) {
                    // 실제로는 감정 이름 조회 필요
                    // emotionName = emotionRepository.findById(group.get(0).getEmotionSeq()).getName();
                }
                applyMediumConnections(group, connections, emotionName);
            } else {
                // 큰 그룹은 특별한 패턴 적용
                String emotionName = "기본";
                applyLargeConnections(group, connections, emotionName);
            }
        }

        // 별자리 그룹 간 최소한의 연결 추가 (필요한 경우)
        if (constellationGroups.size() > 1) {
            connectBetweenConstellations(constellationGroups, connections);
        }

        return connections;
    }

    /**
     * 작은 그룹(2-3개 일기)에 간단한 연결 적용
     */
    private void applySimpleConnections(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        // 일기가 2개면 서로 연결
        if (diaries.size() == 2) {
            int seq1 = diaries.get(0).getDiarySeq();
            int seq2 = diaries.get(1).getDiarySeq();
            addConnection(connections, seq1, seq2);
            return;
        }

        // 일기가 3개면 삼각형 연결
        if (diaries.size() == 3) {
            int seq1 = diaries.get(0).getDiarySeq();
            int seq2 = diaries.get(1).getDiarySeq();
            int seq3 = diaries.get(2).getDiarySeq();

            addConnection(connections, seq1, seq2);
            addConnection(connections, seq2, seq3);
            addConnection(connections, seq3, seq1);
            return;
        }

        // 일기가 1개면 연결 없음
    }

    /**
     * 중간 규모 그룹(4-5개 일기)에 감정 맞춤형 연결 적용
     */
    private void applyMediumConnections(List<Diary> diaries, Map<Integer, List<Integer>> connections, String emotionName) {
        if (diaries.size() < 4) {
            applySimpleConnections(diaries, connections);
            return;
        }

        // 감정별 다른 패턴 적용
        switch (emotionName) {
            case "행복":
                applyStarPattern(diaries, connections); // 별/왕관 모양
                break;
            case "슬픔":
                applyTearPattern(diaries, connections); // 눈물방울 모양
                break;
            case "분노":
                applyLightningPattern(diaries, connections); // 번개 모양
                break;
            case "희망":
                applyArrowPattern(diaries, connections); // 화살표 모양
                break;
            case "평화":
                applyCirclePattern(diaries, connections); // 원형 모양
                break;
            case "공포":
            case "불안":
                applyScatterPattern(diaries, connections); // 흩어진 형태
                break;
            default:
                // 기본 패턴은 중앙 노드 기준 방사형 연결
                applyRadialPattern(diaries, connections);
                break;
        }
    }

    /**
     * 큰 그룹(6개 이상 일기)에 감정 맞춤형 연결 적용
     */
    private void applyLargeConnections(List<Diary> diaries, Map<Integer, List<Integer>> connections, String emotionName) {
        if (diaries.size() < 6) {
            applyMediumConnections(diaries, connections, emotionName);
            return;
        }

        // 감정별 다른 패턴 적용
        switch (emotionName) {
            case "행복":
                applySunPattern(diaries, connections); // 태양 모양
                break;
            case "슬픔":
                applyRiverPattern(diaries, connections); // 강/물결 모양
                break;
            case "분노":
                applyExplosionPattern(diaries, connections); // 폭발 모양
                break;
            case "불안":
                applySpiralPattern(diaries, connections); // 나선형 모양
                break;
            case "평화":
                applyBalancePattern(diaries, connections); // 균형 모양
                break;
            case "희망":
                applyBirdPattern(diaries, connections); // 새/날개 모양
                break;
            case "공포":
                applyScatterPattern(diaries, connections); // 혼란스럽게 흩어진 형태
                break;
            default:
                // 기본은 원형 + 중앙 연결 패턴
                applyCircularPattern(diaries, connections);
                break;
        }
    }

    /**
     * 별자리 그룹 간 연결을 추가합니다.
     * 그룹 간에는 최소한의 연결만 유지합니다.
     */
    private void connectBetweenConstellations(List<List<Diary>> constellationGroups, Map<Integer, List<Integer>> connections) {
        // 각 그룹에서 "중심" 일기를 선택
//        List<Diary> representatives = new ArrayList<>();

//        for (List<Diary> group : constellationGroups) {
//            if (group.isEmpty()) continue;
//
//            // 중심 일기를 선택하는 방법:
//            // 1. 연결이 가장 많은 일기, 또는
//            // 2. 단순하게 첫 번째 일기
//            Diary representative = group.get(0);
//            representatives.add(representative);
//        }
//
//        // 인접 그룹끼리만 체인 형태로 연결
//        for (int i = 0; i < representatives.size() - 1; i++) {
//            int seq1 = representatives.get(i).getDiarySeq();
//            int seq2 = representatives.get(i + 1).getDiarySeq();
//
//            // 연결 추가
//            addConnection(connections, seq1, seq2);
//        }
    }

    /**
     * 방사형 패턴 적용 (중앙 노드와 다른 노드들 연결)
     */
    private void applyRadialPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 2) return;

        // 중앙 노드 선택 (첫 번째 노드 사용)
        int centerSeq = diaries.get(0).getDiarySeq();

        // 중앙 노드와 다른 노드들 연결
        for (int i = 1; i < diaries.size(); i++) {
            int nodeSeq = diaries.get(i).getDiarySeq();
            addConnection(connections, centerSeq, nodeSeq);
        }
    }

    /**
     * 원형 패턴 적용 (노드들이 원형으로 연결)
     */
    private void applyCirclePattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 3) {
            applySimpleConnections(diaries, connections);
            return;
        }

        // 원형으로 연결
        for (int i = 0; i < diaries.size(); i++) {
            int current = diaries.get(i).getDiarySeq();
            int next = diaries.get((i + 1) % diaries.size()).getDiarySeq();
            addConnection(connections, current, next);
        }
    }

    /**
     * 원형 + 중앙 노드 패턴 적용 (원형 + 중앙 노드 연결)
     */
    private void applyCircularPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 4) {
            applyCirclePattern(diaries, connections);
            return;
        }

        // 중앙 노드 선택
        int centerIndex = 0;
        int centerSeq = diaries.get(centerIndex).getDiarySeq();

        // 나머지 노드들을 원형으로 배치
        List<Diary> outerDiaries = new ArrayList<>(diaries);
        outerDiaries.remove(centerIndex);

        // 원형 연결
        for (int i = 0; i < outerDiaries.size(); i++) {
            int current = outerDiaries.get(i).getDiarySeq();
            int next = outerDiaries.get((i + 1) % outerDiaries.size()).getDiarySeq();
            addConnection(connections, current, next);

            // 중앙 노드와 연결 (MAX_CONNECTIONS_PER_DIARY를 고려)
            if (i % 2 == 0 && connections.get(centerSeq).size() < MAX_CONNECTIONS_PER_DIARY) {
                addConnection(connections, centerSeq, current);
            }
        }
    }

    /**
     * 별/왕관 모양 패턴 적용 (행복 감정용)
     */
    private void applyStarPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 4) {
            applySimpleConnections(diaries, connections);
            return;
        }

        // 중앙 노드
        int centerSeq = diaries.get(0).getDiarySeq();

        // 별 모양 연결 (중앙에서 다른 노드로 + 외곽 노드들끼리 연결)
        for (int i = 1; i < diaries.size(); i++) {
            int current = diaries.get(i).getDiarySeq();

            // 중앙과 연결
            addConnection(connections, centerSeq, current);

            // 인접한 외곽 노드와 연결
            if (i < diaries.size() - 1) {
                int next = diaries.get(i + 1).getDiarySeq();
                addConnection(connections, current, next);
            }
        }

        // 마지막 노드와 두 번째 노드 연결해서 별 모양 완성
        if (diaries.size() > 3) {
            int lastSeq = diaries.get(diaries.size() - 1).getDiarySeq();
            int secondSeq = diaries.get(1).getDiarySeq();
            addConnection(connections, lastSeq, secondSeq);
        }
    }

    /**
     * 태양 모양 패턴 적용 (행복 감정용, 큰 그룹)
     */
    private void applySunPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 5) {
            applyStarPattern(diaries, connections);
            return;
        }

        // 중앙 노드 (태양 중심)
        int centerSeq = diaries.get(0).getDiarySeq();

        // 나머지 노드들을 원형으로 배치
        List<Diary> rayDiaries = new ArrayList<>(diaries);
        rayDiaries.remove(0);

        // 원형 연결 (태양 광선)
        for (int i = 0; i < rayDiaries.size(); i++) {
            int current = rayDiaries.get(i).getDiarySeq();

            // 중앙과 연결 (태양 광선)
            addConnection(connections, centerSeq, current);

            // 인접한 노드와 연결 (태양 외곽)
            int next = rayDiaries.get((i + 1) % rayDiaries.size()).getDiarySeq();
            addConnection(connections, current, next);
        }
    }

    /**
     * 눈물방울 모양 패턴 적용 (슬픔 감정용)
     */
    private void applyTearPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 4) {
            applySimpleConnections(diaries, connections);
            return;
        }

        // 눈물방울 위쪽 (첫 번째 노드)
        int topSeq = diaries.get(0).getDiarySeq();

        // 중간 노드들
        for (int i = 1; i < diaries.size() - 1; i++) {
            int current = diaries.get(i).getDiarySeq();

            // 위쪽 노드와 연결
            addConnection(connections, topSeq, current);

            // 인접한 노드와 연결
            if (i < diaries.size() - 2) {
                int next = diaries.get(i + 1).getDiarySeq();
                addConnection(connections, current, next);
            }
        }

        // 맨 아래 노드 (눈물방울 끝)
        if (diaries.size() >= 4) {
            int bottomSeq = diaries.get(diaries.size() - 1).getDiarySeq();
            int secondLastSeq = diaries.get(diaries.size() - 2).getDiarySeq();
            addConnection(connections, secondLastSeq, bottomSeq);
        }
    }

    /**
     * 강/물결 모양 패턴 적용 (슬픔 감정용, 큰 그룹)
     */
    private void applyRiverPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 5) {
            applyTearPattern(diaries, connections);
            return;
        }

        // 강 흐름처럼 지그재그 형태로 연결
        for (int i = 0; i < diaries.size() - 1; i++) {
            int current = diaries.get(i).getDiarySeq();
            int next = diaries.get(i + 1).getDiarySeq();
            addConnection(connections, current, next);
        }

        // 추가 연결로 물결 모양 형성
        if (diaries.size() >= 6) {
            for (int i = 0; i < diaries.size() - 2; i += 2) {
                int current = diaries.get(i).getDiarySeq();
                int skip = diaries.get(i + 2).getDiarySeq();
                if (connections.get(current).size() < MAX_CONNECTIONS_PER_DIARY &&
                        connections.get(skip).size() < MAX_CONNECTIONS_PER_DIARY) {
                    addConnection(connections, current, skip);
                }
            }
        }
    }

    /**
     * 번개 모양 패턴 적용 (분노 감정용)
     */
    private void applyLightningPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 4) {
            applySimpleConnections(diaries, connections);
            return;
        }

        // 번개 형태로 지그재그 연결
        for (int i = 0; i < diaries.size() - 1; i++) {
            int current = diaries.get(i).getDiarySeq();
            int next = diaries.get(i + 1).getDiarySeq();
            addConnection(connections, current, next);
        }
    }

    /**
     * 폭발 모양 패턴 적용 (분노 감정용, 큰 그룹)
     */
    private void applyExplosionPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 5) {
            applyLightningPattern(diaries, connections);
            return;
        }

        // 중앙 노드 (폭발 중심)
        int centerSeq = diaries.get(0).getDiarySeq();

        // 방사형으로 중앙에서 바깥으로 연결
        for (int i = 1; i < diaries.size(); i++) {
            int current = diaries.get(i).getDiarySeq();
            addConnection(connections, centerSeq, current);
        }

        // 바깥쪽 노드들 사이에 불규칙한 연결 추가 (폭발 파편처럼)
        Random random = new Random(42); // 일관된 랜덤 패턴

        List<Diary> outerDiaries = new ArrayList<>(diaries);
        outerDiaries.remove(0);

        for (int i = 0; i < outerDiaries.size(); i++) {
            // 각 노드마다 최대 1개의 추가 연결
            if (connections.get(outerDiaries.get(i).getDiarySeq()).size() < MAX_CONNECTIONS_PER_DIARY) {
                // 랜덤하게 다른 노드 선택
                int j = random.nextInt(outerDiaries.size());
                if (i != j && connections.get(outerDiaries.get(j).getDiarySeq()).size() < MAX_CONNECTIONS_PER_DIARY) {
                    addConnection(connections,
                            outerDiaries.get(i).getDiarySeq(),
                            outerDiaries.get(j).getDiarySeq());
                }
            }
        }
    }

    /**
     * 나선형 패턴 적용 (불안 감정용, 큰 그룹)
     */
    private void applySpiralPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 5) {
            applyCirclePattern(diaries, connections);
            return;
        }

        // 순차적으로 다음 노드와 연결하여 나선형 형성
        for (int i = 0; i < diaries.size() - 1; i++) {
            int current = diaries.get(i).getDiarySeq();
            int next = diaries.get(i + 1).getDiarySeq();
            addConnection(connections, current, next);
        }

        // 추가 연결로 나선 느낌 강화
        if (diaries.size() >= 6) {
            // 첫 번째와 마지막 노드 연결
            addConnection(connections,
                    diaries.get(0).getDiarySeq(),
                    diaries.get(diaries.size() - 1).getDiarySeq());

            // 몇 개의 건너뛰기 연결 추가
            for (int i = 0; i < diaries.size() - 3; i += 3) {
                int current = diaries.get(i).getDiarySeq();
                int skip = diaries.get(i + 3).getDiarySeq();
                if (connections.get(current).size() < MAX_CONNECTIONS_PER_DIARY &&
                        connections.get(skip).size() < MAX_CONNECTIONS_PER_DIARY) {
                    addConnection(connections, current, skip);
                }
            }
        }
    }

    /**
     * 균형 모양 패턴 적용 (평화 감정용, 큰 그룹)
     */
    private void applyBalancePattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 6) {
            applyCirclePattern(diaries, connections);
            return;
        }

        // 중앙 노드
        int centerSeq = diaries.get(0).getDiarySeq();

        // 양쪽으로 균등하게 노드 분할 (음양 형태)
        int half = (diaries.size() - 1) / 2;

        // 왼쪽 그룹 연결 (음)
        for (int i = 1; i <= half; i++) {
            // 중앙과 연결
            addConnection(connections, centerSeq, diaries.get(i).getDiarySeq());

            // 같은 그룹 내 연결
            if (i < half) {
                addConnection(connections,
                        diaries.get(i).getDiarySeq(),
                        diaries.get(i + 1).getDiarySeq());
            }
        }

        // 오른쪽 그룹 연결 (양)
        for (int i = half + 1; i < diaries.size(); i++) {
            // 중앙과 연결
            addConnection(connections, centerSeq, diaries.get(i).getDiarySeq());

            // 같은 그룹 내 연결
            if (i < diaries.size() - 1) {
                addConnection(connections,
                        diaries.get(i).getDiarySeq(),
                        diaries.get(i + 1).getDiarySeq());
            }
        }

        // 양쪽 그룹의 끝 노드 연결해서 원형 완성
        if (half >= 1 && diaries.size() > half + 1) {
            addConnection(connections,
                    diaries.get(half).getDiarySeq(),
                    diaries.get(diaries.size() - 1).getDiarySeq());
        }
    }

    /**
     * 화살표 모양 패턴 적용 (희망 감정용)
     */
    private void applyArrowPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 4) {
            applySimpleConnections(diaries, connections);
            return;
        }

        // 화살촉 (첫 번째 노드)
        int tipSeq = diaries.get(0).getDiarySeq();

        // 화살 몸체 (두 번째 노드)
        int bodySeq = diaries.get(1).getDiarySeq();

        // 화살촉과 몸체 연결
        addConnection(connections, tipSeq, bodySeq);

        // 화살 날개 연결
        for (int i = 2; i < diaries.size(); i++) {
            int wingSeq = diaries.get(i).getDiarySeq();

            // 몸체와 날개 연결
            addConnection(connections, bodySeq, wingSeq);

            // 날개 간 추가 연결 (대칭성 유지)
            if (i >= 3 && i % 2 == 0) {
                int otherWingSeq = diaries.get(i - 1).getDiarySeq();
                addConnection(connections, wingSeq, otherWingSeq);
            }
        }
    }

    /**
     * 새/날개 모양 패턴 적용 (희망 감정용, 큰 그룹)
     */
    private void applyBirdPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 5) {
            applyArrowPattern(diaries, connections);
            return;
        }

        // 몸체 (중앙)
        int bodySeq = diaries.get(0).getDiarySeq();

        // 날개 분할 (왼쪽/오른쪽)
        int leftWingCount = (diaries.size() - 1) / 2;
        int rightWingCount = diaries.size() - 1 - leftWingCount;

        // 왼쪽 날개 연결
        for (int i = 1; i <= leftWingCount; i++) {
            int wingSeq = diaries.get(i).getDiarySeq();

            // 몸체와 연결
            addConnection(connections, bodySeq, wingSeq);

            // 날개 내부 연결
            if (i < leftWingCount) {
                addConnection(connections,
                        wingSeq,
                        diaries.get(i + 1).getDiarySeq());
            }
        }

        // 오른쪽 날개 연결
        for (int i = 0; i < rightWingCount; i++) {
            int wingIndex = leftWingCount + 1 + i;
            int wingSeq = diaries.get(wingIndex).getDiarySeq();

            // 몸체와 연결
            addConnection(connections, bodySeq, wingSeq);

            // 날개 내부 연결
            if (i < rightWingCount - 1) {
                addConnection(connections,
                        wingSeq,
                        diaries.get(wingIndex + 1).getDiarySeq());
            }
        }
    }

    /**
     * 흩어진 형태의 패턴 적용 (공포/불안 감정용)
     */
    private void applyScatterPattern(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        if (diaries.size() < 4) {
            applySimpleConnections(diaries, connections);
            return;
        }

        // 유사도 기반으로 비정형 연결 (최대 연결 수 제한)
        List<DiaryConnection> allConnections = new ArrayList<>();

        // 모든 가능한 연결 쌍의 유사도 계산
        for (int i = 0; i < diaries.size(); i++) {
            for (int j = i + 1; j < diaries.size(); j++) {
                Diary diary1 = diaries.get(i);
                Diary diary2 = diaries.get(j);

                double similarity = calculateTagSimilarity(
                        getDiaryTags(diary1),
                        getDiaryTags(diary2)
                );

                if (similarity >= MIN_SIMILARITY_THRESHOLD) {
                    allConnections.add(new DiaryConnection(
                            diary1.getDiarySeq(),
                            diary2.getDiarySeq(),
                            similarity
                    ));
                }
            }
        }

        // 유사도 순으로 정렬
        allConnections.sort(Comparator.comparing(DiaryConnection::getSimilarity).reversed());

        // 최대 연결 수를 고려하여 높은 유사도의 연결만 추가
        for (DiaryConnection connection : allConnections) {
            int seq1 = connection.getDiary1Seq();
            int seq2 = connection.getDiary2Seq();

            if (connections.get(seq1).size() < MAX_CONNECTIONS_PER_DIARY &&
                    connections.get(seq2).size() < MAX_CONNECTIONS_PER_DIARY) {
                addConnection(connections, seq1, seq2);
            }
        }

        // 모든 일기가 최소 하나의 연결을 가지도록 보장
        ensureMinimalConnections(diaries, connections);
    }

    /**
     * 모든 일기가 최소 하나의 연결을 가지도록 보장
     */
    private void ensureMinimalConnections(List<Diary> diaries, Map<Integer, List<Integer>> connections) {
        for (Diary diary : diaries) {
            int diarySeq = diary.getDiarySeq();

            // 연결이 없는 일기 찾기
            if (connections.get(diarySeq).isEmpty()) {
                // 가장 가까운(태그 유사도 기준) 다른 일기 찾기
                Diary closestDiary = null;
                double highestSimilarity = 0;

                for (Diary other : diaries) {
                    if (other.getDiarySeq().equals(diarySeq)) continue;

                    double similarity = calculateTagSimilarity(
                            getDiaryTags(diary),
                            getDiaryTags(other)
                    );

                    if (similarity > highestSimilarity &&
                            connections.get(other.getDiarySeq()).size() < MAX_CONNECTIONS_PER_DIARY) {
                        highestSimilarity = similarity;
                        closestDiary = other;
                    }
                }

                // 가장 가까운 일기와 연결
                if (closestDiary != null) {
                    addConnection(connections, diarySeq, closestDiary.getDiarySeq());
                } else {
                    // 최악의 경우, 아무 일기나 연결
                    for (Diary other : diaries) {
                        if (!other.getDiarySeq().equals(diarySeq) &&
                                connections.get(other.getDiarySeq()).size() < MAX_CONNECTIONS_PER_DIARY) {
                            addConnection(connections, diarySeq, other.getDiarySeq());
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * 두 일기 간 양방향 연결 추가
     */
    private void addConnection(Map<Integer, List<Integer>> connections, int seq1, int seq2) {
        if (!connections.get(seq1).contains(seq2)) {
            connections.get(seq1).add(seq2);
        }

        if (!connections.get(seq2).contains(seq1)) {
            connections.get(seq2).add(seq1);
        }
    }

    /**
     * 일기의 태그 목록 조회
     */
    private List<String> getDiaryTags(Diary diary) {
        List<DiaryTag> diaryTags = diaryTagRepository.findByDiary(diary);
        return diaryTags.stream()
                .map(diaryTag -> diaryTag.getTag().getName())
                .collect(Collectors.toList());
    }

    /**
     * 두 태그 목록 간 자카드 유사도 계산
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
     * 내부 클래스: 두 일기 간의 연결 정보
     */
    private static class DiaryConnection {
        private final int diary1Seq;
        private final int diary2Seq;
        private final double similarity;

        public DiaryConnection(int diary1Seq, int diary2Seq, double similarity) {
            this.diary1Seq = diary1Seq;
            this.diary2Seq = diary2Seq;
            this.similarity = similarity;
        }

        public int getDiary1Seq() {
            return diary1Seq;
        }

        public int getDiary2Seq() {
            return diary2Seq;
        }

        public double getSimilarity() {
            return similarity;
        }
    }
}
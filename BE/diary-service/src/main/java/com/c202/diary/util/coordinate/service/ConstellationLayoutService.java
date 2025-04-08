package com.c202.diary.util.coordinate.service;

import com.c202.diary.diary.entity.Diary;
import com.c202.diary.emotion.entity.Emotion;
import com.c202.diary.emotion.repository.EmotionRepository;
import com.c202.exception.types.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 별자리 형태의 일기 좌표 배치를 담당하는 서비스
 * 다양한 별자리 패턴 템플릿을 활용하여 3D 공간에 일기를 배치합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConstellationLayoutService {

    private final EmotionRepository emotionRepository;

    // 별자리 템플릿의 기본 스케일 (감정 영역 내부에 맞게 조정됨)
    private static final double BASE_SCALE = 30.0;

    // 별자리 간 최소 거리
    private static final double MIN_CONSTELLATION_DISTANCE = 15.0;

    // 클러스터별 최대 일기 수 (이보다 많으면 여러 별자리로 분할)
    private static final int MAX_DIARIES_PER_CONSTELLATION = 6;

    // 클러스터별 최소 일기 수
    private static final int MIN_DIARIES_PER_CONSTELLATION = 3;

    // 각 일기 간 최소 거리 (충돌 방지용)
    private static final double MIN_DIARY_DISTANCE = 5.0;

    /**
     * 감정에 맞는 별자리 좌표 템플릿을 생성합니다.
     * @param emotion 감정 엔티티
     * @param diaries 배치할 일기 목록
     * @return 생성된 좌표 배열 (각 일기별 [x, y, z] 좌표)
     */
    public double[][] generateConstellationLayout(Emotion emotion, List<Diary> diaries) {
        int count = diaries.size();

        // 일기 수에 따라 적절한 템플릿 선택
        double[][] templatePositions = selectConstellationTemplate(emotion.getName(), count);

        // 템플릿 좌표를 감정 영역에 맞게 스케일링 및 위치 조정
        double[][] positions = adjustTemplateToCenterAndRadius(
                templatePositions,
                emotion.getBaseX(),
                emotion.getBaseY(),
                emotion.getBaseZ(),
                emotion.getBaseRadius() * 0.7  // 감정 영역 반경의 70%까지 사용
        );

        // 충돌 방지를 위한 간단한 force 조정 적용
        return adjustPositionsWithForce(positions, 10);
    }

    /**
     * 여러 그룹의 일기들에 대한 별자리 좌표를 생성합니다.
     * 감정 영역 내에 여러 개의 별자리를 배치합니다.
     * @param emotion 감정 엔티티
     * @param constellationGroups 별자리 그룹 목록 (각 그룹은 하나의 별자리를 형성)
     * @return 그룹별 좌표 배열 맵
     */
    public Map<Integer, double[][]> generateMultipleConstellations(
            Emotion emotion,
            List<List<Diary>> constellationGroups) {

        Map<Integer, double[][]> constellationCoordinates = new HashMap<>();
        int groupCount = constellationGroups.size();

        // 감정 영역 내에 그룹 수만큼 중심점 배치
        double[][] centerPoints = distributePointsInSphere(
                emotion.getBaseX(),
                emotion.getBaseY(),
                emotion.getBaseZ(),
                emotion.getBaseRadius() * 0.7,  // 영역 반경의 70%까지 사용
                groupCount
        );

        // 각 그룹별로 별자리 좌표 생성
        for (int i = 0; i < groupCount; i++) {
            List<Diary> group = constellationGroups.get(i);
            double[] centerPoint = centerPoints[i];

            // 개별 별자리의 크기는 그룹 크기에 비례하되 일정 범위 내로 제한
            double constellationScale = Math.min(
                    emotion.getBaseRadius() * 0.25,  // 최대 크기 (감정 반경의 25%)
                    BASE_SCALE * Math.sqrt(group.size() / 3.0)  // 크기 조정
            );

            // 별자리 템플릿 선택 및 좌표 생성
            double[][] templatePositions = selectConstellationTemplate(emotion.getName(), group.size());
            double[][] adjustedPositions = adjustTemplateToCenterAndRadius(
                    templatePositions,
                    centerPoint[0],
                    centerPoint[1],
                    centerPoint[2],
                    constellationScale
            );

            // 충돌 방지를 위한 force 조정 적용
            double[][] finalPositions = adjustPositionsWithForce(adjustedPositions, 10);

            // 그룹 내 첫 번째 일기의 ID를 키로 사용
            int groupKey = group.get(0).getDiarySeq();
            constellationCoordinates.put(groupKey, finalPositions);
        }

        return constellationCoordinates;
    }

    /**
     * 간단한 force 알고리즘으로 노드 간 최소 거리를 유지하도록 조정합니다.
     * @param positions 초기 좌표 배열
     * @param iterations 반복 횟수
     * @return 조정된 좌표 배열
     */
    public double[][] adjustPositionsWithForce(double[][] positions, int iterations) {
        int n = positions.length;
        if (n <= 1) return positions; // 1개 이하면 조정 불필요

        double[][] adjusted = new double[n][3];
        for (int i = 0; i < n; i++) {
            adjusted[i] = positions[i].clone();
        }

        // 최소 거리 (일기 간 간격)
        double minDistance = MIN_DIARY_DISTANCE;
        // 반발력 상수
        double repulsion = 100.0;

        // 각 반복에서 위치 조정
        for (int iter = 0; iter < iterations; iter++) {
            for (int i = 0; i < n; i++) {
                double[] force = {0, 0, 0};

                // 다른 노드들과의 상호작용 (반발력)
                for (int j = 0; j < n; j++) {
                    if (i == j) continue;

                    double dx = adjusted[i][0] - adjusted[j][0];
                    double dy = adjusted[i][1] - adjusted[j][1];
                    double dz = adjusted[i][2] - adjusted[j][2];

                    double distSq = dx*dx + dy*dy + dz*dz;
                    double dist = Math.sqrt(distSq);

                    // 너무 가까운 노드들만 밀어내기
                    if (dist < minDistance) {
                        double factor = repulsion * (minDistance - dist) / dist;
                        force[0] += dx * factor / dist;
                        force[1] += dy * factor / dist;
                        force[2] += dz * factor / dist;
                    }
                }

                // 변화량 줄이면서 적용 (안정성 증가)
                adjusted[i][0] += force[0] * 0.1;
                adjusted[i][1] += force[1] * 0.1;
                adjusted[i][2] += force[2] * 0.1;
            }
        }

        return adjusted;
    }

    /**
     * 감정 이름과 일기 수에 따라 적절한 별자리 템플릿을 선택합니다.
     * @param emotionName 감정 이름
     * @param count 일기 수
     * @return 선택된 템플릿 좌표 배열
     */
    private double[][] selectConstellationTemplate(String emotionName, int count) {
        // 일기 수가 정해진 범위를 벗어나면 조정
        count = Math.min(Math.max(count, 2), MAX_DIARIES_PER_CONSTELLATION);

        // 감정별로 특색 있는 템플릿 선택
        switch (emotionName) {
            case "행복":
                return count <= 5 ? crownTemplate(count) : sunTemplate(count);
            case "슬픔":
                return count <= 4 ? tearsTemplate(count) : riverTemplate(count);
            case "분노":
                return count <= 5 ? lightningTemplate(count) : explosionTemplate(count);
            case "불안":
                return count <= 4 ? zigzagTemplate(count) : spiralTemplate(count);
            case "평화":
                return count <= 5 ? circleTemplate(count) : balanceTemplate(count);
            case "희망":
                return count <= 4 ? arrowTemplate(count) : birdTemplate(count);
            case "공포":
                return count <= 5 ? scatterTemplate(count) : chaosTemplate(count);
            default:
                // 기본값으로 별/북두칠성 패턴 사용
                return count <= 4 ? starTemplate(count) : bigDipperTemplate(count);
        }
    }

    /**
     * 템플릿 좌표를 중심점과 반경에 맞게 조정합니다.
     * @param template 원본 템플릿 좌표
     * @param centerX 중심 X 좌표
     * @param centerY 중심 Y 좌표
     * @param centerZ 중심 Z 좌표
     * @param radius 반경
     * @return 조정된 좌표 배열
     */
    private double[][] adjustTemplateToCenterAndRadius(
            double[][] template,
            double centerX,
            double centerY,
            double centerZ,
            double radius) {

        int count = template.length;
        double[][] adjusted = new double[count][3];

        // 템플릿의 최대 거리 계산 (정규화를 위해)
        double maxDistance = 0;
        for (double[] point : template) {
            double distance = Math.sqrt(point[0] * point[0] + point[1] * point[1] + point[2] * point[2]);
            maxDistance = Math.max(maxDistance, distance);
        }

        // 템플릿을 지정된 반경 내로 스케일링하고 중심으로 이동
        for (int i = 0; i < count; i++) {
            double scale = radius / Math.max(maxDistance, 1);
            adjusted[i][0] = centerX + template[i][0] * scale;
            adjusted[i][1] = centerY + template[i][1] * scale;
            adjusted[i][2] = centerZ + template[i][2] * scale;
        }

        return adjusted;
    }

    /**
     * 구 내부에 균등하게 분포된 점들을 생성합니다.
     * 별자리 중심점 배치에 사용됩니다.
     * @param centerX 구의 중심 X 좌표
     * @param centerY 구의 중심 Y 좌표
     * @param centerZ 구의 중심 Z 좌표
     * @param radius 구의 반경
     * @param count 생성할 점의 개수
     * @return 생성된 점들의 좌표 배열
     */
    private double[][] distributePointsInSphere(
            double centerX,
            double centerY,
            double centerZ,
            double radius,
            int count) {

        if (count == 1) {
            // 한 개만 필요하면 중앙에 배치
            return new double[][]{{centerX, centerY, centerZ}};
        }

        double[][] points = new double[count][3];
        Random random = new Random(42); // 일관된 랜덤 결과

        if (count <= 4) {
            // 4개 이하면 정사면체 꼭지점에 배치
            double[][] tetrahedron = {
                    {1, 1, 1}, {1, -1, -1}, {-1, 1, -1}, {-1, -1, 1}
            };

            for (int i = 0; i < count; i++) {
                points[i][0] = centerX + radius * 0.7 * tetrahedron[i][0];
                points[i][1] = centerY + radius * 0.7 * tetrahedron[i][1];
                points[i][2] = centerZ + radius * 0.7 * tetrahedron[i][2];
            }
        } else {
            // 피보나치 나선 알고리즘으로 구 표면에 균등하게 점 분포
            double goldenRatio = (1 + Math.sqrt(5)) / 2;

            for (int i = 0; i < count; i++) {
                double t = (double) i / count;
                double inclination = Math.acos(1 - 2 * t);
                double azimuth = 2 * Math.PI * i / goldenRatio;

                // 구면 좌표를 3D 직교 좌표로 변환
                double x = Math.sin(inclination) * Math.cos(azimuth);
                double y = Math.sin(inclination) * Math.sin(azimuth);
                double z = Math.cos(inclination);

                // 반경 내 랜덤한 깊이로 조정 (표면이 아닌 내부에도 배치)
                double depth = 1.0; // 30%~100% 깊이

                points[i][0] = centerX + radius * x * depth;
                points[i][1] = centerY + radius * y * depth;
                points[i][2] = centerZ + radius * z * depth;
            }
        }

        return points;
    }

    /**
     * 감정 이름으로 감정 엔티티를 조회합니다.
     * @param emotionName 감정 이름
     * @return 감정 엔티티
     */
    public Emotion getEmotionByName(String emotionName) {
        return emotionRepository.findByName(emotionName)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 감정입니다: " + emotionName));
    }

    /**
     * 감정 시퀀스로 감정 엔티티를 조회합니다.
     * @param emotionSeq 감정 시퀀스
     * @return 감정 엔티티
     */
    public Emotion getEmotionBySeq(Integer emotionSeq) {
        return emotionRepository.findById(emotionSeq)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 감정입니다 (seq: " + emotionSeq + ")"));
    }

    /*
     * 여기부터는 다양한 별자리 템플릿 정의
     * 각 템플릿은 원점(0,0,0)을 중심으로 정규화된 좌표 반환
     */

    // 1. 태양/해 템플릿 (행복 감정용, 6-7개)
    private double[][] sunTemplate(int count) {
        double[][] template = new double[count][3];

        // 중심점
        template[0] = new double[]{0, 0, 0};

        // 주변 점들을 원형으로 배치
        double angleStep = 2 * Math.PI / (count - 1);
        for (int i = 1; i < count; i++) {
            double angle = angleStep * (i - 1);
            template[i] = new double[]{
                    Math.cos(angle),
                    Math.sin(angle),
                    0.2 * Math.sin(angle * 2) // 약간의 3D 효과
            };
        }

        return template;
    }

    // 2. 왕관 템플릿 (행복 감정용, 5개 이하)
    private double[][] crownTemplate(int count) {
        double[][] template = new double[count][3];

        if (count <= 2) {
            template[0] = new double[]{-0.5, 0, 0};
            if (count > 1) template[1] = new double[]{0.5, 0, 0};
            return template;
        }

        // 중심점
        template[0] = new double[]{0, 0, 0};

        // 아래 라인 (2점)
        template[1] = new double[]{-0.8, -0.3, 0};
        template[2] = new double[]{0.8, -0.3, 0};

        // 추가 점들은 위쪽에 왕관 모양으로
        if (count >= 4) template[3] = new double[]{-0.4, 0.8, 0};
        if (count >= 5) template[4] = new double[]{0.4, 0.8, 0};
        if (count >= 6) template[5] = new double[]{0, 1, 0};
        if (count >= 7) template[6] = new double[]{0, 0.4, 0.5};

        return template;
    }

    // 3. 눈물 템플릿 (슬픔 감정용, 4개 이하)
    private double[][] tearsTemplate(int count) {
        double[][] template = new double[count][3];

        if (count <= 1) {
            template[0] = new double[]{0, 0, 0};
            return template;
        }

        // 눈물 모양 (위에서 아래로)
        template[0] = new double[]{0, 0.8, 0};      // 상단
        template[1] = new double[]{0, -0.5, 0};     // 하단

        if (count >= 3) template[2] = new double[]{-0.3, 0.3, 0}; // 좌측
        if (count >= 4) template[3] = new double[]{0.3, 0.3, 0};  // 우측

        return template;
    }

    // 4. 강/물결 템플릿 (슬픔 감정용, 5-7개)
    private double[][] riverTemplate(int count) {
        double[][] template = new double[count][3];

        // 곡선 형태의 강 모양
        for (int i = 0; i < count; i++) {
            double t = (double) i / (count - 1);
            // 사인 곡선으로 흐르는 강 형태
            template[i] = new double[]{
                    t * 2 - 1,
                    Math.sin(t * Math.PI * 1.5) * 0.5,
                    Math.cos(t * Math.PI) * 0.2
            };
        }

        return template;
    }

    // 5. 번개 템플릿 (분노 감정용, 5개 이하)
    private double[][] lightningTemplate(int count) {
        double[][] template = new double[count][3];

        if (count <= 1) {
            template[0] = new double[]{0, 0, 0};
            return template;
        }

        // 번개 형태 (지그재그 라인)
        double height = 2.0 / (count - 1);
        for (int i = 0; i < count; i++) {
            double y = 1.0 - i * height;
            double x = (i % 2 == 0) ? 0.4 : -0.4;
            template[i] = new double[]{x, y, 0};
        }

        return template;
    }

    // 6. 폭발 템플릿 (분노 감정용, 6-7개)
    private double[][] explosionTemplate(int count) {
        double[][] template = new double[count][3];

        // 중앙점
        template[0] = new double[]{0, 0, 0};

        // 불규칙한 폭발 형태 (중앙에서 방사형으로)
        Random random = new Random(42); // 일관된 랜덤값
        for (int i = 1; i < count; i++) {
            double angle = 2 * Math.PI * i / (count - 1);
            // 각도별로 다른 길이와 높이
            double len = 0.5 + 0.5 * random.nextDouble();
            double z = 0.3 * (random.nextDouble() - 0.5);

            template[i] = new double[]{
                    Math.cos(angle) * len,
                    Math.sin(angle) * len,
                    z
            };
        }

        return template;
    }

    // 7. 지그재그 템플릿 (불안 감정용, 4개 이하)
    private double[][] zigzagTemplate(int count) {
        double[][] template = new double[count][3];

        // 지그재그 패턴
        for (int i = 0; i < count; i++) {
            double t = (double) i / (count - 1);
            double x = t * 2 - 1; // -1에서 1까지
            double y = (i % 2 == 0) ? 0.5 : -0.5; // 위 아래 번갈아가며
            template[i] = new double[]{x, y, 0};
        }

        return template;
    }

    // 8. 나선형 템플릿 (불안 감정용, 5-7개)
    private double[][] spiralTemplate(int count) {
        double[][] template = new double[count][3];

        // 나선형 패턴
        for (int i = 0; i < count; i++) {
            double t = (double) i / (count - 1);
            double radius = t * 0.8;
            double angle = t * 5 * Math.PI;

            template[i] = new double[]{
                    radius * Math.cos(angle),
                    radius * Math.sin(angle),
                    t * 0.5 - 0.25 // 약간의 3D 효과
            };
        }

        return template;
    }

    // 9. 원형 템플릿 (평화 감정용, 5개 이하)
    private double[][] circleTemplate(int count) {
        double[][] template = new double[count][3];

        if (count <= 1) {
            template[0] = new double[]{0, 0, 0};
            return template;
        }

        // 완전한 원 형태
        for (int i = 0; i < count; i++) {
            double angle = 2 * Math.PI * i / count;
            template[i] = new double[]{
                    Math.cos(angle),
                    Math.sin(angle),
                    0
            };
        }

        return template;
    }

    // 10. 균형 템플릿 (평화 감정용, 6-7개)
    private double[][] balanceTemplate(int count) {
        double[][] template = new double[count][3];

        // 음양 형태의 균형
        template[0] = new double[]{0, 0, 0}; // 중앙

        int half = (count - 1) / 2;
        int remaining = count - 1 - half;

        // 윗부분 곡선 (양)
        for (int i = 1; i <= half; i++) {
            double t = (double) (i - 1) / half;
            double angle = Math.PI * t;
            template[i] = new double[]{
                    Math.cos(angle) * 0.5,
                    0.5 + Math.sin(angle) * 0.5,
                    0
            };
        }

        // 아랫부분 곡선 (음)
        for (int i = 0; i < remaining; i++) {
            double t = (double) i / remaining;
            double angle = Math.PI + Math.PI * t;
            template[half + 1 + i] = new double[]{
                    Math.cos(angle) * 0.5,
                    -0.5 + Math.sin(angle) * 0.5,
                    0
            };
        }

        return template;
    }

    // 11. 화살표 템플릿 (희망 감정용, 4개 이하)
    private double[][] arrowTemplate(int count) {
        double[][] template = new double[count][3];

        if (count <= 1) {
            template[0] = new double[]{0, 0, 0};
            return template;
        }

        if (count == 2) {
            template[0] = new double[]{-0.5, 0, 0};
            template[1] = new double[]{0.5, 0, 0};
            return template;
        }

        // 화살표 형태 (위쪽 방향)
        template[0] = new double[]{0, 0.8, 0};   // 화살촉
        template[1] = new double[]{-0.4, 0, 0};  // 좌측 하단
        template[2] = new double[]{0.4, 0, 0};   // 우측 하단

        if (count >= 4) {
            template[3] = new double[]{0, 0.3, 0}; // 중앙 몸체
        }

        return template;
    }

    // 15. 별 템플릿
    private double[][] starTemplate(int count) {
        double[][] template = new double[count][3];

        if (count <= 1) {
            template[0] = new double[]{0, 0, 0};
            return template;
        }

        if (count <= 3) {
            // 삼각형
            for (int i = 0; i < count; i++) {
                double angle = 2 * Math.PI * i / count;
                template[i] = new double[]{
                        Math.cos(angle),
                        Math.sin(angle),
                        0
                };
            }
            return template;
        }

        // 별 모양 (5꼭지점)
        double innerRadius = 0.4;
        double outerRadius = 1.0;

        for (int i = 0; i < count; i++) {
            // 짝수 인덱스는 외부 점, 홀수 인덱스는 내부 점
            double radius = (i % 2 == 0) ? outerRadius : innerRadius;
            double angle = Math.PI / 2 + 2 * Math.PI * i / 10;  // 10포인트로 별 모양 생성

            template[i] = new double[]{
                    radius * Math.cos(angle),
                    radius * Math.sin(angle),
                    0
            };

            // 4개일 경우 5번째 점은 생성하지 않음
            if (i >= count - 1) break;
        }

        return template;
    }

    // 16. 북두칠성 템플릿
    private double[][] bigDipperTemplate(int count) {
        // 진짜 북두칠성과 유사한 형태
        double[][] baseTemplate = {
                {0, 0, 0},      // 국자 손잡이 시작
                {0.3, 0.1, 0},  // 손잡이 중간
                {0.6, 0.15, 0}, // 손잡이 끝
                {0.7, 0.5, 0},  // 국자 가장자리 시작
                {0.3, 0.6, 0},  // 국자 가장자리
                {0, 0.5, 0},    // 국자 가장자리
                {-0.3, 0.6, 0}  // 국자 가장자리 끝
        };

        // 원하는 개수만큼 잘라서 반환
        double[][] template = new double[Math.min(count, baseTemplate.length)][3];
        for (int i = 0; i < template.length; i++) {
            template[i] = baseTemplate[i].clone();
        }

        return template;
    }

    // 12. 새/날개 템플릿 (희망 감정용, 5-7개)
    private double[][] birdTemplate(int count) {
        double[][] template = new double[count][3];

        // 날개를 펼친 새 형태
        template[0] = new double[]{0, 0, 0}; // 중앙(몸체)

        if (count <= 2) {
            if (count >= 2) template[1] = new double[]{0.8, 0, 0};
            return template;
        }

        // 왼쪽 날개
        int leftWing = Math.min(3, (count - 1) / 2);
        for (int i = 0; i < leftWing; i++) {
            double t = (double) (i + 1) / (leftWing + 1);
            template[i + 1] = new double[]{
                    -t * 0.8,
                    Math.sin(t * Math.PI * 0.5) * 0.5,
                    0
            };
        }

        // 오른쪽 날개
        int rightWing = count - 1 - leftWing;
        for (int i = 0; i < rightWing; i++) {
            double t = (double) (i + 1) / (rightWing + 1);
            template[leftWing + 1 + i] = new double[]{
                    t * 0.8,
                    Math.sin(t * Math.PI * 0.5) * 0.5,
                    0
            };
        }

        return template;
    }

    // 13. 흩어진 템플릿 (공포 감정용, 5개 이하)
    private double[][] scatterTemplate(int count) {
        double[][] template = new double[count][3];

        // 중앙에 하나, 나머지는 비규칙적으로 흩어짐
        template[0] = new double[]{0, 0, 0};

        // 고정된 시드로 일관된 랜덤 패턴 생성
        Random random = new Random(42);
        for (int i = 1; i < count; i++) {
            // 대체로 같은 평면에 흩어져 있되 약간의 z 변화
            template[i] = new double[]{
                    (random.nextDouble() - 0.5) * 1.6,
                    (random.nextDouble() - 0.5) * 1.6,
                    (random.nextDouble() - 0.5) * 0.4
            };
        }

        return template;
    }

    // 14. 혼돈 템플릿 (공포 감정용, 6-7개)
    private double[][] chaosTemplate(int count) {
        double[][] template = new double[count][3];

        // 완전한 3D 랜덤 분포
        Random random = new Random(43);
        for (int i = 0; i < count; i++) {
            double phi = Math.acos(2 * random.nextDouble() - 1);
            double theta = 2 * Math.PI * random.nextDouble();
            double r = 0.2 + 0.8 * random.nextDouble();

            template[i] = new double[]{
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi)
            };
        }

        return template;
    }
}
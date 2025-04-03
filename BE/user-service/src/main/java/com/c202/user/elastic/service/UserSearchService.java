package com.c202.user.elastic.service;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.c202.user.elastic.document.UserDocument;
import com.c202.user.elastic.model.request.UserSearchRequestDto;
import com.c202.user.elastic.model.response.UserSearchResponseDto;
import com.c202.user.elastic.repository.UserSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSearchService {

    private final ElasticsearchOperations elasticsearchOperations;
    private final UserSearchRepository userSearchRepository;

    public List<UserSearchResponseDto> searchUsers(UserSearchRequestDto requestDto) {
        // 쿼리 빌더 생성
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

        // 삭제되지 않은 사용자
        boolQueryBuilder.must(Query.of(q -> q
                .term(t -> t
                        .field("isDeleted")
                        .value("N")
                )
        ));

        // 키워드 검색 조건 설정
        if (requestDto.getKeyword() != null && !requestDto.getKeyword().isEmpty()) {
            BoolQuery.Builder keywordQueryBuilder = new BoolQuery.Builder();

            if (requestDto.isSearchUsername()) {
                keywordQueryBuilder.should(Query.of(q -> q
                        .match(m -> m
                                .field("username")
                                .query(requestDto.getKeyword())
                        )
                ));
            }

            if (requestDto.isSearchNickname()) {
                keywordQueryBuilder.should(Query.of(q -> q
                        .match(m -> m
                                .field("nickname")
                                .query(requestDto.getKeyword())
                        )
                ));
            }

            boolQueryBuilder.must(Query.of(q -> q.bool(keywordQueryBuilder.build())));
        }

        // 쿼리 생성
        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(q -> q.bool(boolQueryBuilder.build()))
                .build();

        // 검색 실행
        SearchHits<UserDocument> searchHits = elasticsearchOperations.search(
                searchQuery, UserDocument.class);

        // 결과 변환
        List<UserSearchResponseDto> result = new ArrayList<>();
        for (SearchHit<UserDocument> hit : searchHits) {
            UserDocument doc = hit.getContent();
            UserSearchResponseDto userDto = UserSearchResponseDto.fromDocument(doc);
            result.add(userDto);
        }

        return result;
    }
}
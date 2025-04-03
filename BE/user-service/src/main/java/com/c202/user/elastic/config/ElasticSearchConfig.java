package com.c202.user.elastic.config;

import com.c202.user.elastic.repository.UserSearchRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackageClasses = UserSearchRepository.class)
@Slf4j
public class ElasticSearchConfig extends ElasticsearchConfiguration {

    @Value("${spring.elasticsearch.uris}")
    private String elasticURL;

    @Override
    public ClientConfiguration clientConfiguration() {
        String host = elasticURL.replaceAll("https?://", "");
        log.info("host: " + host);
        return ClientConfiguration.builder()
                .connectedTo(host)
                .build();
    }
}
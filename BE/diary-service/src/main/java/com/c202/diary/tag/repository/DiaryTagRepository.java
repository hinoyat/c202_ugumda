package com.c202.diary.tag.repository;

import com.c202.diary.tag.entity.DiaryTag;
import com.c202.diary.tag.entity.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface DiaryTagRepository extends JpaRepository<DiaryTag, Integer> {
    @Query(value = "SELECT t.* FROM tag t " +
            "JOIN diary_tag dt ON t.tag_seq = dt.tag_seq " +
            "JOIN diary d ON d.diary_seq = dt.diary_seq " +
            "WHERE d.user_seq = :userSeq " +
            "GROUP BY t.tag_seq " +
            "ORDER BY MAX(dt.created_at) DESC " +
            "LIMIT :limit", nativeQuery = true)
    List<Tag> findRecentTagsByUserSeq(int userSeq, int limit);
}

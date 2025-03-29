package com.c202.user.user.repository;

import com.c202.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserSeq(Integer userSeq);
    boolean existsByUsername(String username);
    boolean existsByNickname(String nickname);
    Optional<User> findByUsername(String username);

    @Query(value = "SELECT * FROM users WHERE isDeleted = 'N' ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<User> findRandomActiveUser();
}

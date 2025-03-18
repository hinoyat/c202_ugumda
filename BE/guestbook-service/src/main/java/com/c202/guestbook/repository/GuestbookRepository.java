package com.c202.guestbook.repository;


import com.c202.guestbook.entity.Guestbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestbookRepository extends JpaRepository<Guestbook, Integer> {
    Guestbook findByGuestbookSeq(Integer guestbookSeq);
    List<Guestbook> findByOwnerSeqAndIsDeleted(Integer ownerSeq, String isDeleted);
}
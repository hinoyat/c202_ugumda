package com.c202.guestbook.service;

import com.c202.guestbook.model.GuestbookDto;

import java.util.List;

public interface GuestbookService {
    GuestbookDto createGuestbook(int ownerSeq, int writerSeq, GuestbookDto guestbookDTO);
    List<GuestbookDto> getAllGuestbooks(int ownerSeq);
    void deleteGuestbook(int userSeq, int guestbookSeq);
}
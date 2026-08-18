package com.kaushalsetu.modules.user.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    // Files land under uploads/<subfolder>/ in the project directory, served via
    // WebConfig's /uploads/** resource handler.
    private static final String UPLOAD_ROOT = "uploads/";

    /**
     * Saves a file under uploads/{subfolder}/ with a unique, collision-proof name and
     * returns the PUBLIC URL PATH (e.g. "/uploads/kyc/documents/3_a1b2c3.jpg") to store
     * on the entity — never the raw filesystem path.
     */
    public String saveFile(MultipartFile file, Integer userId, String subfolder) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path dir = Paths.get(UPLOAD_ROOT + subfolder);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }

        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
        String fileName = userId + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

        Path filePath = dir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + subfolder + "/" + fileName;
    }

    // Kept for backward compatibility with any older callers.
    public String saveFile(MultipartFile file, Long userId) throws IOException {
        return saveFile(file, userId.intValue(), "kyc");
    }
}

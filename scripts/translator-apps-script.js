/**
 * Tecsub Translator — Google Apps Script (FIXED)
 * ════════════════════════════════════════════════
 * WHAT WAS BROKEN:
 *   Drive.Files.insert()  ← V2 API, deprecated & removed
 *
 * THE FIX:
 *   Drive.Files.create()  ← V3 API, current
 *
 * HOW TO DEPLOY:
 *   1. Open https://script.google.com → your existing project
 *   2. Replace ALL code with this file
 *   3. Click Deploy → Manage Deployments → Edit → New version → Deploy
 *   4. Copy the new Execution URL
 *   5. Paste it into TranslatorTool.tsx as SCRIPT_URL
 */

// ─── Main entry point ───────────────────────────────────────────
function doPost(e) {
    try {
        var payload = JSON.parse(e.postData.contents);
        var fileData = payload.fileData;   // base64 string
        var fileName = payload.fileName;
        var targetLang = payload.targetLang || "si";

        // 1. Decode the uploaded file
        var bytes = Utilities.base64Decode(fileData);
        var blob = Utilities.newBlob(bytes, getMimeType(fileName), fileName);

        // 2. Extract plain text from the document
        var text = extractText(blob, fileName);
        if (!text || text.trim() === "") {
            return jsonResponse({ status: "error", message: "Could not extract text from the document." });
        }

        // 3. Translate in chunks (Google Translate limit: ~5000 chars)
        var translated = translateInChunks(text, targetLang);

        // 4. Convert translated text to PDF
        // ✅ FIX: Use Drive.Files.create() not Drive.Files.insert()
        var pdfBlob = createPdfFromText(translated, fileName, targetLang);

        // 5. Return base64-encoded PDF
        var pdfBase64 = Utilities.base64Encode(pdfBlob.getBytes());
        return jsonResponse({ status: "success", pdfData: pdfBase64 });

    } catch (err) {
        return jsonResponse({ status: "error", message: err.message });
    }
}

// ─── CORS preflight ─────────────────────────────────────────────
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({ status: "ok", message: "Tecsub Translator API" }))
        .setMimeType(ContentService.MimeType.JSON);
}

// ─── Text extraction ────────────────────────────────────────────
function extractText(blob, fileName) {
    var ext = fileName.split(".").pop().toLowerCase();

    if (ext === "txt" || ext === "md") {
        return blob.getDataAsString("UTF-8");
    }

    if (ext === "docx" || ext === "doc") {
        // ✅ FIX: Drive.Files.create instead of Drive.Files.insert
        var docFile = Drive.Files.create(
            { name: fileName, mimeType: "application/vnd.google-apps.document" },
            blob,
            { supportsAllDrives: true }
        );
        var doc = DocumentApp.openById(docFile.id);
        var text = doc.getBody().getText();
        Drive.Files.remove(docFile.id);   // clean up
        return text;
    }

    if (ext === "pdf") {
        // Upload as Google Doc (Drive auto-converts)
        // ✅ FIX: Drive.Files.create instead of Drive.Files.insert
        var pdfUpload = Drive.Files.create(
            { name: fileName, mimeType: "application/vnd.google-apps.document" },
            blob,
            { supportsAllDrives: true }
        );
        var pdfDoc = DocumentApp.openById(pdfUpload.id);
        var pdfText = pdfDoc.getBody().getText();
        Drive.Files.remove(pdfUpload.id);
        return pdfText;
    }

    // Fallback: try as plain text
    try { return blob.getDataAsString("UTF-8"); } catch { return ""; }
}

// ─── Chunked translation ─────────────────────────────────────────
function translateInChunks(text, targetLang) {
    var MAX_CHARS = 4800;
    if (text.length <= MAX_CHARS) {
        return LanguageApp.translate(text, "", targetLang);
    }

    var parts = [];
    var paragraphs = text.split("\n");
    var current = "";

    for (var i = 0; i < paragraphs.length; i++) {
        if ((current + "\n" + paragraphs[i]).length > MAX_CHARS) {
            if (current.trim()) {
                parts.push(LanguageApp.translate(current.trim(), "", targetLang));
            }
            current = paragraphs[i];
        } else {
            current += (current ? "\n" : "") + paragraphs[i];
        }
    }
    if (current.trim()) {
        parts.push(LanguageApp.translate(current.trim(), "", targetLang));
    }

    return parts.join("\n\n");
}

// ─── Create PDF from text ────────────────────────────────────────
function createPdfFromText(text, originalName, targetLang) {
    // ✅ FIX: Drive.Files.create instead of Drive.Files.insert
    var tempDoc = Drive.Files.create({ name: "temp_translation", mimeType: "application/vnd.google-apps.document" });
    var doc = DocumentApp.openById(tempDoc.id);
    var body = doc.getBody();

    body.clear();
    body.setMarginLeft(36).setMarginRight(36).setMarginTop(36).setMarginBottom(36);

    // Title
    var title = body.appendParagraph("Tecsub Translator — " + originalName);
    title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    title.setAttributes({ [DocumentApp.Attribute.FONT_SIZE]: 16 });

    body.appendParagraph("Target Language: " + targetLang + " | Translated by Tecsub Solutions")
        .setAttributes({ [DocumentApp.Attribute.FOREGROUND_COLOR]: "#888888", [DocumentApp.Attribute.FONT_SIZE]: 9 });

    body.appendHorizontalRule();

    // Content
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
        body.appendParagraph(lines[i]).setAttributes({ [DocumentApp.Attribute.FONT_SIZE]: 11 });
    }

    doc.saveAndClose();

    // Export to PDF
    var pdfBlob = DriveApp.getFileById(tempDoc.id).getAs("application/pdf");
    Drive.Files.remove(tempDoc.id);
    return pdfBlob;
}

// ─── Helpers ────────────────────────────────────────────────────
function getMimeType(fileName) {
    var ext = fileName.split(".").pop().toLowerCase();
    var map = {
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "doc": "application/msword",
        "pdf": "application/pdf",
        "txt": "text/plain",
        "md": "text/plain",
    };
    return map[ext] || "application/octet-stream";
}

function jsonResponse(obj) {
    return ContentService
        .createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}

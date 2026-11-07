"""
document_loader.py
------------------
Utility to load documents from various file types into LangChain Document objects.

Supported formats:
  - PDF  (.pdf)           via PyPDFLoader
  - DOCX (.docx, .doc)    via Docx2txtLoader
  - XLSX (.xlsx, .xls)    via openpyxl
  - CSV  (.csv)           via csv reader
  - PPTX (.pptx)          via python-pptx
  - TXT  (.txt, .md, .log, .json)
  - ZIP  (.zip)           auto-extract & parse inner files
"""

import os
import csv
import zipfile
import tempfile
from pathlib import Path
from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
)


def _load_csv(path: Path) -> list[Document]:
    docs = []
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.reader(f)
        rows = list(reader)
        if not rows:
            return docs
        header = rows[0]
        for idx, row in enumerate(rows[1:], start=1):
            row_text = ", ".join(f"{h}: {val}" for h, val in zip(header, row) if val.strip())
            if row_text.strip():
                docs.append(Document(
                    page_content=row_text,
                    metadata={"source": path.name, "row": idx, "file_path": str(path.resolve())}
                ))
    return docs


def _load_xlsx(path: Path) -> list[Document]:
    import openpyxl
    wb = openpyxl.load_workbook(str(path), data_only=True)
    docs = []
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        sheet_rows = []
        for row in sheet.iter_rows(values_only=True):
            clean_row = [str(cell) for cell in row if cell is not None]
            if clean_row:
                sheet_rows.append(" | ".join(clean_row))
        if sheet_rows:
            docs.append(Document(
                page_content=f"Sheet: {sheet_name}\n" + "\n".join(sheet_rows),
                metadata={"source": path.name, "sheet": sheet_name, "file_path": str(path.resolve())}
            ))
    return docs


def _load_pptx(path: Path) -> list[Document]:
    import pptx
    prs = pptx.Presentation(str(path))
    docs = []
    for idx, slide in enumerate(prs.slides, start=1):
        slide_text = []
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.text.strip():
                slide_text.append(shape.text.strip())
        if slide_text:
            docs.append(Document(
                page_content=f"Slide {idx}:\n" + "\n".join(slide_text),
                metadata={"source": path.name, "slide": idx, "file_path": str(path.resolve())}
            ))
    return docs


def _load_zip(path: Path) -> list[Document]:
    docs = []
    with tempfile.TemporaryDirectory() as temp_dir:
        with zipfile.ZipFile(str(path), 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
            docs = load_directory(temp_dir, recursive=True)
            for d in docs:
                d.metadata["source"] = f"{path.name}::{d.metadata.get('source', '')}"
    return docs


# ── Single file loader ───────────────────────────────────────────────────────
def load_file(file_path: str) -> list[Document]:
    """
    Load a single file into LangChain Documents.

    Supports: .pdf, .txt, .md, .docx, .doc, .xlsx, .xls, .csv, .pptx, .zip
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = path.suffix.lower()

    if ext == ".pdf":
        loader = PyPDFLoader(str(path))
        docs = loader.load()
    elif ext in [".txt", ".md", ".log", ".json"]:
        loader = TextLoader(str(path), encoding="utf-8")
        docs = loader.load()
    elif ext in [".docx", ".doc"]:
        loader = Docx2txtLoader(str(path))
        docs = loader.load()
    elif ext == ".csv":
        docs = _load_csv(path)
    elif ext in [".xlsx", ".xls"]:
        docs = _load_xlsx(path)
    elif ext == ".pptx":
        docs = _load_pptx(path)
    elif ext == ".zip":
        docs = _load_zip(path)
    else:
        # Fallback to plain text read
        try:
            loader = TextLoader(str(path), encoding="utf-8")
            docs = loader.load()
        except Exception:
            raise ValueError(f"Unsupported file type: '{ext}'.")

    # Ensure consistent source metadata
    for doc in docs:
        doc.metadata.setdefault("source", path.name)
        doc.metadata["file_path"] = str(path.resolve())

    print(f"[Loader] ✓ Loaded '{path.name}' → {len(docs)} item(s)")
    return docs


# ── Directory loader ─────────────────────────────────────────────────────────
def load_directory(
    dir_path: str,
    glob: str = "**/*",
    recursive: bool = True,
) -> list[Document]:
    path = Path(dir_path)
    if not path.is_dir():
        raise NotADirectoryError(f"Not a directory: {dir_path}")

    supported_extensions = [".pdf", ".txt", ".md", ".docx", ".doc", ".xlsx", ".xls", ".csv", ".pptx", ".zip"]
    all_docs = []

    for ext in supported_extensions:
        pattern = f"**/*{ext}" if recursive else f"*{ext}"
        files = list(path.glob(pattern))
        for file in files:
            try:
                docs = load_file(str(file))
                all_docs.extend(docs)
            except Exception as e:
                print(f"[Loader] ⚠️  Skipping '{file.name}': {e}")

    print(f"[Loader] ✓ Total loaded from directory: {len(all_docs)} document(s)")
    return all_docs


def load_files(file_paths: list[str]) -> list[Document]:
    all_docs = []
    for fp in file_paths:
        try:
            docs = load_file(fp)
            all_docs.extend(docs)
        except Exception as e:
            print(f"[Loader] ⚠️  Skipping '{fp}': {e}")
    return all_docs

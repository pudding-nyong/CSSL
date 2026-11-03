
// ========================================
// CSSL SYMBOL DATABASE
// ========================================

// 01. FUNCTIONAL SYMBOL SET

const PREFIX = {
    "⸸": "절단 명령",
    "∅": "삭제 상태",
    "⛒": "경고",
    "◉": "감시 활성",
    "⤫": "침식 실행",
    "×": "완전 제거",
    "⛓": "연결",
    "⟳": "루프",
    "〄": "몽환",
    "∫": "정지"
};


// 02. CORE ALPHABET

const ALPHABET = {
    "D": "Disconnect / 절단",
    "V": "Void / 공허",
    "E": "Error / 시스템 오류",
    "O": "Observe / 관측",
    "C": "Corrupt / 침식",
    "X": "Erase / 제거",
    "L": "Link / 연결",
    "R": "Reset / 초기화",
    "M": "Morphean / 몽환",
    "S": "Silence / 정지",
    "H": "Human / 인간 대상",
    "T": "Target / 지정 대상"
};


// 03. AUXILIARY RULES

const AUXILIARY = [
    { symbol: "-숫자", meaning: "강도 / 단계" },
    { symbol: "•", meaning: "불확정" },
    { symbol: "?", meaning: "질의" },
    { symbol: "_", meaning: "진행 중" },
    { symbol: "::", meaning: "명령 전환" }
];

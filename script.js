
// ========================================
// CSSL TRANSLATOR
// THREE-STAGE INTERPRETER
// ========================================

const inputText = document.getElementById("inputText");

const rawOutput = document.getElementById("rawOutput");
const conceptOutput = document.getElementById("conceptOutput");
const naturalOutput = document.getElementById("naturalOutput");

const translateButton = document.getElementById("translateButton");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");

const errorMessage = document.getElementById("errorMessage");


// ----------------------------------------
// 1. CSSL 기호 데이터
// ----------------------------------------

const CORE_MEANINGS = {
    D: "절단",
    V: "공허",
    E: "시스템 오류",
    O: "관측",
    C: "침식",
    X: "제거",
    L: "연결",
    R: "초기화",
    M: "몽환",
    S: "정지",
    H: "인간 대상",
    T: "지정 대상"
};

const PREFIX_ACTIONS = {
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


// ----------------------------------------
// 2. STAGE 1
// RAW SIGNAL
// ----------------------------------------

function stageOne(raw) {
    return raw.trim();
}


// ----------------------------------------
// 3. 신호 배열 분리
// ----------------------------------------

function splitSignals(raw) {

    const groups = [];

    const parts = raw.split(/(::|>)/);

    let separator = null;

    for (const part of parts) {

        const trimmed = part.trim();

        if (!trimmed) continue;

        if (trimmed === "::" || trimmed === ">") {
            separator = trimmed;
            continue;
        }

        groups.push({
            separator: separator,
            signal: trimmed
        });

        separator = null;
    }

    return groups;
}


// ----------------------------------------
// 4. 개별 신호 분석
// ----------------------------------------

function analyzeSignal(signal) {

    let remaining = signal;

    const result = {
        original: signal,
        prefix: [],
        concepts: [],
        intensity: [],
        uncertain: false,
        ongoing: false,
        query: false
    };


    // 기능 기호 분석
    for (const symbol of Object.keys(PREFIX_ACTIONS)) {

        if (remaining.includes(symbol)) {

            result.prefix.push({
                symbol: symbol,
                meaning: PREFIX_ACTIONS[symbol]
            });

            remaining = remaining.replace(symbol, "");
        }
    }


    // 보조 기호 분석
    if (remaining.includes("•")) {
        result.uncertain = true;
        remaining = remaining.replaceAll("•", "");
    }

    if (remaining.includes("_")) {
        result.ongoing = true;
        remaining = remaining.replaceAll("_", "");
    }

    if (remaining.includes("?")) {
        result.query = true;
        remaining = remaining.replaceAll("?", "");
    }


    // 강도 / 단계 분석
    const intensityMatches = remaining.matchAll(/-(\d+)/g);

    for (const match of intensityMatches) {
        result.intensity.push(Number(match[1]));
    }

    remaining = remaining.replace(/-\d+/g, "");


    // 핵심 문자 분석
    const coreMatches = remaining.matchAll(/[DVEOCXLRMSHT](\d*)/g);

    for (const match of coreMatches) {

        const symbol = match[0][0];
        const number = match[1];

        result.concepts.push({
            symbol: symbol,
            meaning: ALPHABET[symbol] || CORE_MEANINGS[symbol],
            count: number ? Number(number) : null
        });
    }

    return result;
}


// ----------------------------------------
// 5. STAGE 2
// CONCEPT INTERPRETATION
// ----------------------------------------

function stageTwo(raw) {

    const groups = splitSignals(raw);

    const analyzed = groups.map(group => {

        return {
            separator: group.separator,
            data: analyzeSignal(group.signal)
        };

    });

    return analyzed;
}


// ----------------------------------------
// 6. STAGE 2 화면 출력
// ----------------------------------------

function renderConcepts(groups) {

    if (groups.length === 0) {
        return "분석할 신호가 없습니다.";
    }

    let html = "";

    groups.forEach((group, index) => {

        const data = group.data;

        if (group.separator === "::") {
            html += `
                <div class="separator-label">
                    :: COMMAND TRANSITION / 명령 전환
                </div>
            `;
        }

        if (group.separator === ">") {
            html += `
                <div class="separator-label">
                    > ARRAY SEPARATION / 배열 구분
                </div>
            `;
        }

        html += `
            <div class="concept-group">
                <h3> SIGNAL ${String(index + 1).padStart(2, "0")} </h3>
        `;


        // 기능 기호
        data.prefix.forEach(item => {
            html += `
                <p>
                    <strong>${item.symbol}</strong>
                    ${item.meaning}
                </p>
            `;
        });


        // 핵심 문자
        data.concepts.forEach(item => {

            html += `
                <p>
                    <strong>${item.symbol}</strong>
                    ${item.meaning}
                    ${item.count !== null
                        ? " / 대상 수: " + item.count
                        : ""}
                </p>
            `;

        });


        // 강도
        data.intensity.forEach(value => {
            html += `<p>강도 / 단계: ${value}</p>`;
        });


        // 보조 기호
        if (data.uncertain) {
            html += `<p>불확정한 추정</p>`;
        }

        if (data.ongoing) {
            html += `<p>진행 중 표시</p>`;
        }

        if (data.query) {
            html += `<p>질의</p>`;
        }


        if (
            data.prefix.length === 0 &&
            data.concepts.length === 0
        ) {
            html += `<p>해석 가능한 기호 없음</p>`;
        }

        html += `</div>`;

    });

    return html;
}


// ----------------------------------------
// 7. STAGE 3
// NATURAL LANGUAGE
// ----------------------------------------

function stageThree(groups) {

    const sentences = [];

    groups.forEach((group, index) => {

        const data = group.data;

        const prefixes = data.prefix.map(item => item.meaning);

        const concepts = data.concepts;

        const getConcept = symbol =>
            concepts.find(item => item.symbol === symbol);

        const human = getConcept("H");
        const target = getConcept("T");

        const error = getConcept("E");
        const observe = getConcept("O");
        const corrupt = getConcept("C");
        const death = getConcept("D");
        const erase = getConcept("X");
        const voidConcept = getConcept("V");
        const link = getConcept("L");
        const reset = getConcept("R");
        const dream = getConcept("M");
        const silence = getConcept("S");

        const intensityText = data.intensity.length
            ? ` (강도 ${data.intensity.join(", ")})`
            : "";

        const uncertaintyText = data.uncertain
            ? "으로 추정되는"
            : "";

        const ongoingText = data.ongoing
            ? "진행 중"
            : "발생";

        let sentence = "";


        // 경고 + 시스템 오류
        if (error && prefixes.includes("경고")) {

            sentence =
                `경고: ${error.meaning} 발생${intensityText}.`;
        }

        // 감시 + 관측
        else if (observe) {

            let subject = "";

            if (human) {
                subject =
                    `인간 ${human.count ?? ""}명${uncertaintyText}`;
            }

            else if (target) {
                subject =
                    `지정 대상 ${target.count ?? ""}개${uncertaintyText}`;
            }

            else {
                subject = "지정된 대상";
            }

            sentence =
                `${prefixes.length ? prefixes.join(" / ") + ": " : ""}` +
                `${subject}을 관측하고 있다` +
                `${data.ongoing ? " (진행 중)" : ""}.`;
        }

        // 침식
        else if (corrupt) {

             sentence =
                `${prefixes.length ? prefixes.join(" / ") + ": " : ""}` +
                `${data.ongoing ? "침식이 진행 중이다" : "침식이 발생했다"}` +
                `${intensityText}.`;
        }

        // 절단
        else if (death) {

            sentence =
                `${prefixes.length ? prefixes.join(" / ") + ": " : ""}` +
                `절단 명령이 실행된다${intensityText}.`;
        }

        // 제거
        else if (erase) {

            sentence =
                `${prefixes.length ? prefixes.join(" / ") + ": " : ""}` +
                `제거 명령이 실행된다${intensityText}.`;
        }

        // 공허
        else if (voidConcept) {

            sentence = "공허 상태가 확인되었다.";
        }

        // 연결
        else if (link) {

            sentence = "연결이 실행된다.";
        }

        // 초기화
        else if (reset) {

            sentence = "초기화";

            if (data.query) {
                sentence += "에 관한 질의가 발생했다.";
            } else {
                sentence += "가 실행된다.";
            }
        }

        // 몽환
        else if (dream) {

            sentence = "몽환 상태가 발생했다.";
        }

        // 정지
        else if (silence) {

            sentence = "정지 상태가 실행된다.";
        }

        // 기타
        else {

            sentence = concepts
                .map(item => item.meaning)
                .join(" / ") || "해석할 수 없는 신호";
            
            sentence += ".";
        }


        // 강도 정보가 아직 문장에 포함되지 않은 경우
        if (
            data.intensity.length &&
            !sentence.includes("강도")
        ) {
            sentence = sentence.replace(
                /\.$/,
                `${intensityText}.`
            );
        }


        // 명령 전환
        if (group.separator === "::") {
            sentence = "다음 명령으로 전환. " + sentence;
        }

        sentences.push(sentence);

    });

    return sentences.join(" ");
}


// ----------------------------------------
// 8. 번역 실행
// ----------------------------------------

function translate() {

    const raw = inputText.value.trim();

    errorMessage.textContent = "";

    if (!raw) {

        errorMessage.textContent =
            "CSSL 신호를 입력해 주세요.";

        return;
    }


    // STAGE 1
    const stage1 = stageOne(raw);

    rawOutput.textContent = stage1;


    // STAGE 2
    const stage2 = stageTwo(stage1);

    conceptOutput.innerHTML =
        renderConcepts(stage2);


    // STAGE 3
    const stage3 = stageThree(stage2);

    naturalOutput.textContent = stage3;

}


// ----------------------------------------
// 9. 버튼 기능
// ----------------------------------------

translateButton.addEventListener("click", translate);


clearButton.addEventListener("click", () => {

    inputText.value = "";

    rawOutput.textContent = "입력 대기 중...";
    conceptOutput.textContent = "분석 대기 중...";
    naturalOutput.textContent = "번역 대기 중...";

    errorMessage.textContent = "";

});


copyButton.addEventListener("click", async () => {

    const text = naturalOutput.textContent;

    if (
        !text ||
        text === "번역 대기 중..."
    ) {
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        copyButton.textContent = "COPIED!";

        setTimeout(() => {
            copyButton.textContent = "COPY RESULT";
        }, 1500);

    } catch (error) {

        errorMessage.textContent =
            "복사할 수 없습니다. 결과를 직접 복사해 주세요.";

    }

});


// ----------------------------------------
// 10. DATABASE DISPLAY
// ----------------------------------------

const dictionaryList =
    document.getElementById("dictionaryList");

if (dictionaryList) {

    dictionaryList.innerHTML = `

        <section class="dictionary-section">

            <h3>01 / FUNCTIONAL SYMBOL SET</h3>

            <div class="dictionary-grid">

                ${Object.entries(PREFIX).map(
                    ([symbol, meaning]) => `
                        <div class="dictionary-item">
                            <strong>${symbol}</strong>
                            <span>${meaning}</span>
                        </div>
                    `
                ).join("")}

            </div>

        </section>


        <section class="dictionary-section">

            <h3>02 / CORE ALPHABET</h3>

            <div class="dictionary-grid">

                ${Object.entries(ALPHABET).map(
                    ([symbol, meaning]) => `
                        <div class="dictionary-item">
                            <strong>${symbol}</strong>
                            <span>${meaning}</span>
                        </div>
                    `
                ).join("")}

            </div>

        </section>


        <section class="dictionary-section">

            <h3>03 / AUXILIARY RULES</h3>

            <div class="auxiliary-grid">

                ${AUXILIARY.map(item => `
                    <div class="auxiliary-item">
                        <strong>${item.symbol}</strong>
                        <span>${item.meaning}</span>
                    </div>
                `).join("")}

            </div>

        </section>

    `;
}

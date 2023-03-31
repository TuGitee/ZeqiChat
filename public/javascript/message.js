function formatEveryMessage() {
    const innerData = document.querySelectorAll('.inner-data');
    for (let i = 0; i < innerData.length; i++) {
        formatMessage(innerData[i]);
    }
}

const newLine = ';newline;'
const leftArrow = ';leftarrow;'
const rightArrow = ';rightarrow;'

const ExgType = {
    img: new RegExp(`${leftArrow}img src="(http(s)?:\/\/.+|\/uploads\/.*?\.webp)" ?\/?${rightArrow}`, 'g'),
    a: new RegExp(`${leftArrow}a href="(http(s)?:\/\/.+)"${rightArrow}(.*)${leftArrow}\/?a${rightArrow}`, 'g'),
    video: new RegExp(`${leftArrow}video src="(http(s)?:\/\/.+)"${rightArrow}${leftArrow}\/?video${rightArrow}`, 'g'),
    audio: new RegExp(`${leftArrow}audio src="(http(s)?:\/\/.+)"${rightArrow}${leftArrow}\/?audio${rightArrow}`, 'g'),
    i: new RegExp(`${leftArrow}i${rightArrow}(.*?)${leftArrow}\/?i${rightArrow}`, 'g'),
    em: new RegExp(`${leftArrow}em${rightArrow}(.*?)${leftArrow}\/?em${rightArrow}`, 'g'),
    b: new RegExp(`${leftArrow}b${rightArrow}(.*?)${leftArrow}\/?b${rightArrow}`, 'g'),
    strong: new RegExp(`${leftArrow}strong${rightArrow}(.*?)${leftArrow}\/?strong${rightArrow}`, 'g'),

    u: new RegExp(`${leftArrow}u${rightArrow}(.*?)${leftArrow}\/?u${rightArrow}`, 'g'),
    s: new RegExp(`${leftArrow}s${rightArrow}(.*?)${leftArrow}\/?s${rightArrow}`, 'g'),
    del: new RegExp(`${leftArrow}del${rightArrow}(.*?)${leftArrow}\/?del${rightArrow}`, 'g'),
    color: new RegExp(`${leftArrow}color(:|=)"?(.*?)"?${rightArrow}(.*?)${leftArrow}\/?color${rightArrow}`, 'g'),
    size: new RegExp(`${leftArrow}size(:|=)"?(.*?)"?${rightArrow}(.*?)${leftArrow}\/?size${rightArrow}`, 'g'),
    h1: new RegExp(`${leftArrow}h1${rightArrow}(.*?)${leftArrow}\/?h1${rightArrow}`, 'g'),
    h2: new RegExp(`${leftArrow}h2${rightArrow}(.*?)${leftArrow}\/?h2${rightArrow}`, 'g'),
    h3: new RegExp(`${leftArrow}h3${rightArrow}(.*?)${leftArrow}\/?h3${rightArrow}`, 'g'),
    h4: new RegExp(`${leftArrow}h4${rightArrow}(.*?)${leftArrow}\/?h4${rightArrow}`, 'g'),
    h5: new RegExp(`${leftArrow}h5${rightArrow}(.*?)${leftArrow}\/?h5${rightArrow}`, 'g'),
    h6: new RegExp(`${leftArrow}h6${rightArrow}(.*?)${leftArrow}\/?h6${rightArrow}`, 'g'),
    p: new RegExp(`${leftArrow}p${rightArrow}(.*?)${leftArrow}\/?p${rightArrow}`, 'g'),
    code: new RegExp(`${leftArrow}code(:|=)"?(.*?)"?${rightArrow}${newLine}(.*?)${leftArrow}\/?code${rightArrow}`, 'g'),

    pre: new RegExp(`${leftArrow}pre${rightArrow}\\s*(.*?)${leftArrow}\/?pre${rightArrow}`, 'g'),
    blockquote: new RegExp(`${leftArrow}blockquote${rightArrow}${newLine}(.*?)${leftArrow}\/?blockquote${rightArrow}`, 'g'),

    li: new RegExp(`${leftArrow}li${rightArrow}(.*?)${leftArrow}\/?li${rightArrow}`, 'g'),

    hr: new RegExp(`${leftArrow}hr ?\/?${rightArrow}`, 'g'),

    md_b_i: new RegExp(`\\*\\*\\*(.*?)\\*\\*\\*`, 'g'),
    md_b: new RegExp(`\\*\\*(.*?)\\*\\*`, 'g'),
    md_i: new RegExp(`\\*(.*?)\\*`, 'g'),
    md_h6: new RegExp(`\\#\\#\\#\\#\\#\\#\\s(.*?)${newLine}`, 'g'),
    md_h5: new RegExp(`\\#\\#\\#\\#\\#\\s(.*?)${newLine}`, 'g'),
    md_h4: new RegExp(`\\#\\#\\#\\#\\s(.*?)${newLine}`, 'g'),
    md_h3: new RegExp(`\\#\\#\\#\\s(.*?)${newLine}`, 'g'),
    md_h2: new RegExp(`\\#\\#\\s(.*?)${newLine}`, 'g'),
    md_h1: new RegExp(`\\#\\s(.*?)${newLine}`, 'g'),
    md_code: new RegExp(`\`\`\`[\\s]*${newLine}(.*?)\`\`\``, 'g'),
    md_codeword: new RegExp(`\`(.*?)\``, 'g'),
    md_blockquote: new RegExp(`${rightArrow}(.*)${newLine}`, 'g'),
    md_hr: new RegExp(`-{3,}${newLine}`, 'g'),
    md_li: new RegExp(`-(.*?)${newLine}`, 'g'),
}

function formatMessage(node) {
    if (!node?.getAttribute('data-format')) {
        for (const reg in ExgType) {
            if (ExgType[reg].test(node.innerHTML)) {
                node.innerHTML = node.innerHTML.trim().replace(ExgType[reg], (match, p1, p2, p3) => {
                    switch (reg) {
                        case 'img':
                            if (p1) return `<img src="${p1}" />`;
                            else return `${leftArrow}${reg}${rightArrow}${leftArrow}/${reg}${rightArrow}`
                        case 'a':
                            if (!p1) return `${match}`
                            if (!p3) return `<a href="${p1}">匿名链接，请谨慎点击</a>`
                            return `<a href="${p1}">${p3}</a>`;
                        case 'video': case 'audio':
                            if (!p1) return `${match}`
                            return `<${reg} controls src="${p1}"></${reg}>`;
                        case 'hr': case 'md_hr':
                            return `<hr />`;
                        case 'i': case 'b': case 'u': case 's': case 'del': case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': case 'p': case 'blockquote': case 'em': case 'strong': case 'li':
                            if (!p1) return `${match}`
                            return `<${reg}>${p1}</${reg}>`
                        case 'md_b': case 'md_i': case 'md_h1': case 'md_h2': case 'md_h3': case 'md_h4': case 'md_h5': case 'md_h6': case 'md_li': case 'md_codeword':
                            if (!p1) return `${match}`
                            return `<${reg.replace('md_', '')}>${p1}</${reg.replace('md_', '')}>`
                        case 'md_b_i':
                            if (!p1) return `${match}`
                            return `<b><i>${p1}</i></b>`
                        case 'md_blockquote':
                            if (!p1) return `${match}`
                            p1 = p1.replace(new RegExp(`${newLine}${rightArrow}`, 'g'), `${newLine}`)
                            return `<blockquote>${p1}</blockquote>`
                        case 'md_code':
                            if (!p1) return `${match}`
                            return `<pre><code class="language-plaintext">${p1.replace(new RegExp(newLine, 'g'), '\n').replace(/\</g, leftArrow).replace(/\>/g, rightArrow)}</code></pre>`;
                        case 'code':
                            if (!p2) return `<pre><code class="language-plaintext">${p3}</code></pre>`
                            if (!p3) return `<code class="language-${p2}">代码段</code>`
                            return `<pre><code class="language-${p2}">${p3.replace(new RegExp(newLine, 'g'), '\n').replace(/\</g, leftArrow).replace(/\>/g, rightArrow)}</code></pre>`;
                        case 'color':
                            if (!p2) return `${match}`
                            if (!p3) return `<span style="color:${p2}">文字</span>`
                            return `<span style="color:${p2}">${p3}</span>`;
                        case 'size':
                            if (!p2) return `${match}`
                            if (!p3) return `<span style="font-size:${p2 > 100 ? 100 : p2}px">文字</span>`
                            return `<span style="font-size:${p2 > 100 ? 100 : p2}px">${p3}</span>`;
                    }
                });
            }
        }
        node.textContent = node.innerHTML.replace(new RegExp(newLine, "g"), '<br/>').replace(new RegExp(leftArrow, "g"), '&lt;').replace(new RegExp(rightArrow, "g"), '&gt;')
        node.innerHTML = node.textContent;
        node.setAttribute('data-format', true);
    }
    const el = node.querySelector('pre code');
    if (!el) return;
    if (!el.getAttribute('code-format')) {
        hljs.lineNumbersBlock(el);
        hljs.highlightElement(el);
        el.setAttribute('code-format', 'true');
    }
}

function removeSlash(string) {
    return string.replace(/\n/g, newLine).replace(/</g, leftArrow).replace(/>/g, rightArrow).replace(/<|>/g, '');
}

// 日韩词典应用逻辑
// JP-KO Dictionary App

(function() {
    'use strict';

    // 状态
    let currentMode = 'ja-ko';
    let searchHistory = JSON.parse(localStorage.getItem('jpkodict_history') || '[]');

    // DOM 元素
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsSection = document.getElementById('resultsSection');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // 初始化
    function init() {
        renderHistory();
        bindEvents();
        updatePlaceholder();
    }

    // 绑定事件
    function bindEvents() {
        searchBtn.addEventListener('click', performSearch);
        clearBtn.addEventListener('click', clearSearch);
        clearHistoryBtn.addEventListener('click', clearAllHistory);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                updatePlaceholder();
                performSearch();
            });
        });
    }

    // 更新输入框提示
    function updatePlaceholder() {
        if (currentMode === 'ja-ko') {
            searchInput.placeholder = '输入日语单词（如：愛、学校、食べる）...';
        } else {
            searchInput.placeholder = '输入韩语单词（如：사랑、학교、먹다）...';
        }
    }

    // 搜索
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            showEmptyState();
            return;
        }

        const data = DICTIONARY_DATA[currentMode];
        const results = searchData(data, query);

        if (results.length === 0) {
            showNoResults(query);
        } else {
            showResults(results, query);
        }

        addToHistory(query);
    }

    // 搜索数据
    function searchData(data, query) {
        const lowerQuery = query.toLowerCase();
        return data.filter(item => {
            if (currentMode === 'ja-ko') {
                return item.ja.includes(query) ||
                       item.reading.includes(query) ||
                       item.ko.includes(query) ||
                       item.meaning.includes(query);
            } else {
                return item.ko.includes(query) ||
                       item.ja.includes(query) ||
                       item.reading.includes(query) ||
                       item.meaning.includes(query);
            }
        });
    }

    // 显示结果
    function showResults(results, query) {
        const html = results.map(item => {
            if (currentMode === 'ja-ko') {
                return `
                    <div class="result-item">
                        <div class="word-main">
                            <span class="word-ja">${highlightText(item.ja, query)}</span>
                            <span class="word-reading">${highlightText(item.reading, query)}</span>
                        </div>
                        <div class="word-ko">${highlightText(item.ko, query)}</div>
                        <span class="word-pos">${item.pos}</span>
                        <div class="word-meaning">${item.meaning}</div>
                        <div class="word-example">
                            <div class="example-ja">${item.example.ja}</div>
                            <div class="example-ko">${item.example.ko}</div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="result-item">
                        <div class="word-ko">${highlightText(item.ko, query)}</div>
                        <div class="word-main">
                            <span class="word-ja">${highlightText(item.ja, query)}</span>
                            <span class="word-reading">${highlightText(item.reading, query)}</span>
                        </div>
                        <span class="word-pos">${item.pos}</span>
                        <div class="word-meaning">${item.meaning}</div>
                        <div class="word-example">
                            <div class="example-ko">${item.example.ko}</div>
                            <div class="example-ja">${item.example.ja}</div>
                        </div>
                    </div>
                `;
            }
        }).join('');

        resultsSection.innerHTML = html;
    }

    // 高亮文本
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // 转义正则特殊字符
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 显示空状态
    function showEmptyState() {
        resultsSection.innerHTML = `
            <div class="empty-state">
                <p>输入日语或韩语单词开始查询</p>
                <p class="hint">支持假名、汉字、韩文搜索</p>
            </div>
        `;
    }

    // 显示无结果
    function showNoResults(query) {
        resultsSection.innerHTML = `
            <div class="no-results">
                <p>未找到 "${escapeHtml(query)}" 的搜索结果</p>
                <p class="hint">请尝试其他关键词</p>
            </div>
        `;
    }

    // 转义 HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 清除搜索
    function clearSearch() {
        searchInput.value = '';
        showEmptyState();
        searchInput.focus();
    }

    // 添加到历史
    function addToHistory(query) {
        if (!query) return;
        searchHistory = searchHistory.filter(h => h !== query);
        searchHistory.unshift(query);
        if (searchHistory.length > 20) {
            searchHistory = searchHistory.slice(0, 20);
        }
        localStorage.setItem('jpkodict_history', JSON.stringify(searchHistory));
        renderHistory();
    }

    // 渲染历史
    function renderHistory() {
        if (searchHistory.length === 0) {
            historyList.innerHTML = '<p style="color:#999;font-size:0.9rem;">暂无查询历史</p>';
            return;
        }

        historyList.innerHTML = searchHistory.map(item => `
            <button class="history-tag" onclick="window.setSearchQuery('${escapeHtml(item)}')">${escapeHtml(item)}</button>
        `).join('');
    }

    // 清除所有历史
    function clearAllHistory() {
        searchHistory = [];
        localStorage.removeItem('jpkodict_history');
        renderHistory();
    }

    // 全局函数供历史标签调用
    window.setSearchQuery = function(query) {
        searchInput.value = query;
        performSearch();
    };

    // 启动
    init();
})();

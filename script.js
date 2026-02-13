(() => {
    const content = document.getElementById("content");
    const sidebar = document.getElementById("sidebar");
    const themeToggle = document.getElementById("themeToggle");
    const toast = document.getElementById("toast");

    const showToast = (msg) => {
        toast.textContent = msg;
        toast.style.display = "block";
        setTimeout(() => toast.style.display = "none", 2000);
    };

    const sanitize = (str) => {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    };

    themeToggle.addEventListener("click", () => {
        const current = localStorage.getItem("theme") || "light";
        setTheme(current === "light" ? "dark" : "light");
    });

    setTheme(localStorage.getItem("theme") || "light");

    const tools = {
        text() {
            content.innerHTML = `
                <div class="card">
                    <textarea id="textInput" rows="6"></textarea>
                    <button id="countBtn">统计</button>
                    <div id="result"></div>
                </div>
            `;
            document.getElementById("countBtn").onclick = () => {
                const text = document.getElementById("textInput").value;
                const chars = text.length;
                const lines = text.split("\n").length;
                const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                document.getElementById("result").innerHTML =
                    `字符数: ${chars} | 行数: ${lines} | 单词数: ${words}`;
            };
        },

        encode() {
            content.innerHTML = `
                <div class="card">
                    <textarea id="encodeInput"></textarea>
                    <button id="b64">Base64编码</button>
                    <button id="b64d">Base64解码</button>
                    <div id="encodeResult"></div>
                </div>
            `;
            document.getElementById("b64").onclick = () => {
                const val = document.getElementById("encodeInput").value;
                document.getElementById("encodeResult").textContent =
                    btoa(unescape(encodeURIComponent(val)));
            };
            document.getElementById("b64d").onclick = () => {
                try {
                    const val = document.getElementById("encodeInput").value;
                    document.getElementById("encodeResult").textContent =
                        decodeURIComponent(escape(atob(val)));
                } catch {
                    showToast("解码失败");
                }
            };
        },

        time() {
            content.innerHTML = `
                <div class="card">
                    <input id="timestampInput" placeholder="输入时间戳" />
                    <button id="toDate">转日期</button>
                    <div id="timeResult"></div>
                </div>
            `;
            document.getElementById("toDate").onclick = () => {
                const ts = parseInt(document.getElementById("timestampInput").value);
                if (isNaN(ts)) return showToast("无效时间戳");
                const date = new Date(ts);
                document.getElementById("timeResult").textContent =
                    date.toLocaleString();
            };
        },

        random() {
            content.innerHTML = `
                <div class="card">
                    <button id="uuidBtn">生成UUID</button>
                    <div id="uuidResult"></div>
                </div>
            `;
            document.getElementById("uuidBtn").onclick = () => {
                const uuid = crypto.randomUUID();
                document.getElementById("uuidResult").textContent = uuid;
            };
        },

        storage() {
            content.innerHTML = `
                <div class="card">
                    <button id="refresh">刷新列表</button>
                    <ul id="storageList"></ul>
                </div>
            `;
            const render = () => {
                const ul = document.getElementById("storageList");
                ul.innerHTML = "";
                Object.keys(localStorage).forEach(key => {
                    const li = document.createElement("li");
                    li.textContent = key + ": " + localStorage.getItem(key);
                    ul.appendChild(li);
                });
            };
            document.getElementById("refresh").onclick = render;
            render();
        }
    };

    sidebar.addEventListener("click", e => {
        if (e.target.dataset.tool) {
            tools[e.target.dataset.tool]();
        }
    });

    tools.text();
})();

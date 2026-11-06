(() => {
  const cfg = window.BANK_CONFIG || {};
  const ABI = [
    "function deposit() payable",
    "function withdraw(uint256 amount)",
    "function checkBlance() view returns (uint256)"
  ];
  const $ = (id) => document.getElementById(id);
  let mode = "deposit", account = null, provider = null, signer = null, bank = null;

  function status(message, kind = "") {
    const el = $("status");
    if (!el) return;
    el.className = `status ${kind}`;
    el.innerHTML = `<i class="dot"></i><span>${message}</span>`;
  }
  function short(address) { return `${address.slice(0, 6)}…${address.slice(-4)}`; }

  async function refreshBalance() {
    if (!bank || !account) return;
    try {
      const value = await bank.checkBlance();
      $("balance").innerHTML = `${Number(ethers.formatEther(value)).toFixed(4)} <span style="font-size:15px">ETH</span>`;
      $("balanceNote").textContent = "ยอดจาก Smart Contract บน Sepolia";
    } catch (error) {
      status(`อ่านยอดไม่สำเร็จ: ${error.shortMessage || error.message}`, "error");
    }
  }

  async function connect() {
    if (!window.ethereum) return status("ไม่พบ MetaMask กรุณาเปิดเว็บใน Chrome ที่ติดตั้ง MetaMask", "error");
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        status("กรุณาเลือกเครือข่าย Sepolia ใน MetaMask แล้วกดเชื่อมต่ออีกครั้ง", "error");
        return;
      }
      if (!ethers.isAddress(cfg.contractAddress)) return status("ที่อยู่ Smart Contract ใน config.js ไม่ถูกต้อง", "error");
      account = accounts[0];
      signer = await provider.getSigner();
      bank = new ethers.Contract(cfg.contractAddress, ABI, signer);
      const addressLabel = $("address");
      if (addressLabel) addressLabel.textContent = short(account);
      const connectButton = $("connect");
      if (connectButton) connectButton.textContent = short(account);
      status("เชื่อมต่อ MetaMask และ Smart Contract บน Sepolia แล้ว", "ok");
      await refreshBalance();
    } catch (error) {
      status(error.shortMessage || error.message, "error");
    }
  }

  async function submit() {
    if (!bank) return status("กรุณากดเชื่อมต่อ MetaMask ก่อน", "error");
    const raw = $("amount").value;
    if (!raw || !Number.isFinite(Number(raw)) || Number(raw) <= 0) return status("กรุณาใส่จำนวน ETH ที่มากกว่า 0", "error");
    try {
      status("กรุณาตรวจสอบและยืนยันธุรกรรมใน MetaMask…");
      const tx = mode === "deposit"
        ? await bank.deposit({ value: ethers.parseEther(raw) })
        : await bank.withdraw(ethers.parseEther(raw));
      status("ส่งธุรกรรมแล้ว กำลังรอการยืนยันบน Sepolia…");
      await tx.wait();
      status("ทำรายการสำเร็จ", "ok");
      $("amount").value = "";
      await refreshBalance();
    } catch (error) {
      status(error.shortMessage || error.reason || error.message, "error");
    }
  }

  document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    mode = button.dataset.mode;
    $("submit").textContent = mode === "deposit" ? "ฝากเงินเข้าบัญชี" : "ถอนเงินจากบัญชี";
  }));
  $("connect")?.addEventListener("click", connect);
  $("submit")?.addEventListener("click", submit);
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => location.reload());
    window.ethereum.on("chainChanged", () => location.reload());
  }
})();

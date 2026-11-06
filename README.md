# ธนาคารดิจิทัล DApp (Infura + MetaMask)

หน้าเว็บนี้ทำตามโจทย์: เชื่อม Smart Contract, เชื่อม MetaMask, ฝาก, ถอน, ตรวจสอบยอด และแสดงข้อมูลผู้ใช้ ตัวอย่างตั้งค่าเครือข่าย Sepolia และใช้ Infura สำหรับอ่านข้อมูลจาก RPC ส่วน MetaMask ใช้ลงนามธุรกรรม

## ก่อนใช้งาน

1. สมัคร/เข้าสู่ระบบ Infura แล้วสร้าง API key สำหรับ Ethereum Sepolia
2. ติดตั้ง MetaMask และเลือกเครือข่าย Sepolia พร้อมรับ Sepolia ETH สำหรับค่าธรรมเนียมจาก faucet ที่เชื่อถือได้
3. เปิด `Bank.sol` ใน Remix, compile ด้วย Solidity 0.8.20 และ deploy ไป Sepolia โดยเลือก Injected Provider - MetaMask
4. คัดลอก contract address ที่ deploy ได้
5. แก้ `config.js` ใส่ `infuraProjectId` และ `contractAddress`
6. เปิด `index.html` ผ่าน local web server หรือ GitHub Pages (อย่าเปิดเป็น `file://` ถ้า browser บล็อกการเชื่อมต่อ)
7. เชื่อม MetaMask โดยต้องเลือก Sepolia แล้วลองฝาก/ถอน/ตรวจยอด

## GitHub Pages

อัปโหลด `index.html`, `app.js`, `config.js`, `Bank.sol` และ README ไปยัง repository จากนั้นเปิด Settings → Pages → Deploy from a branch แล้วเลือก branch/folder ที่เก็บหน้าเว็บ URL ที่ GitHub Pages สร้างให้คือ URL สำหรับส่งงาน

## ข้อควรทราบ

- ค่าคอนฟิกในหน้าเว็บถูกส่งให้ browser เห็นได้เสมอ ควรจำกัดโดเมนและเครือข่ายของ Infura key ใน dashboard และห้ามใส่ secret/API secret
- สัญญานี้เป็นตัวอย่างเพื่อการศึกษา ใช้เงินทดสอบบน Sepolia เท่านั้น ไม่ควรใช้กับเงินจริง
- เมธอด `checkBlance` สะกดตามโจทย์ที่แนบมา
- ชื่อและรหัสนักศึกษายังไม่ได้รับจากผู้ใช้ จึงเว้นพื้นที่ให้เติมบนหน้าเว็บก่อนส่งงาน

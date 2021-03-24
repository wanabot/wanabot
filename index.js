const fs = require("fs");
const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const SESSION_FILE_PATH = "./session.json";

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
  puppeteer: { headless: false },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

let index;

const AddGetData = (chat, number) => {
  /* Function Add History Get Data */
  if (fs.existsSync("dataGet.json")) {
    const data = JSON.parse(
      fs.readFileSync("dataGet.json", { encoding: "utf-8" })
    );
    let newData = [];
    data.map((item) => {
      if (item.nomor === chat.id.user) {
        newData.push({ nomor: item.nomor, get: item.get });
              if (item.get === 0);
      } else {
        newData.push(item);
      }
    });
    fs.writeFileSync("dataGet.json", JSON.stringify(newData));
  } else {
    let newData = [];
    number.map((item) => {
      if (item !== "") {
        newData.push({ nomor: item, get: 0 });
      }
    });
    fs.writeFileSync("dataGet.json", JSON.stringify(newData));
  }
  /* ---------------------------- */
};

client.on("message", async (msg) => {
  /* Read Data Number Client */
  const number = [];
  fs.readFileSync("./nomor.txt", { encoding: "utf-8" })
    .split("\n")
    .map((item) => {
      number.push(item.replace("\r", ""));
    });
  /* ---------------------- */
  let chat = await msg.getChat();
  if (!chat.isGroup) {
    if (number.includes(chat.id.user)) {
      if (msg.body.match(/#cek/gi)) {
        /* Function Add History Get Data */
        if (fs.existsSync("dataGet.json")) {
          const data = JSON.parse(
            fs.readFileSync("dataGet.json", { encoding: "utf-8" })
          );
          let newData = [];
          data.map((item) => {
            if (item.nomor === msg.body.replace("#cek ", "")) {
              newData.push({ nomor: item.nomor, get: item.get });
              if (item.get === 0) {
                client.sendMessage(
                  msg.from,
                  `${item.nomor} belum mengambil NO OTP`
                );
              } else {
                client.sendMessage(
                  msg.from,
                  `${item.nomor} sudah mengambil NO OTP sebanyak ${item.get} kali`
                );
              }
            } else {
              newData.push(item);
            }
          });
          fs.writeFileSync("dataGet.json", JSON.stringify(newData));
        } else {
          let newData = [];
          number.map((item) => {
            if (item !== "") {
              newData.push({ nomor: item, get: 0 });
            }
          });
          fs.writeFileSync("dataGet.json", JSON.stringify(newData));
        }
        /* ---------------------------- */
      } else if (msg.body.match(/#regis/gi)) {
        /* Read Data Number Client */
        const number = [];
        fs.readFileSync("./nomor.txt", { encoding: "utf-8" })
          .split("\n")
          .map((item) => {
            number.push(item.replace("\r", ""));
          });

        /* Add Data Number Client */
        const newNum = msg.body.split(" ")[1];
        let data = "";
        if (!number.includes(newNum)) {
          number.push(newNum);
          number.map((num) => {
            if (num !== "") {
              data += `${num}\n`;
            }
          });
          fs.writeFileSync("./nomor.txt", data);
          client.sendMessage(
            msg.from,
            `Success! ${newNum} Telah Teregistrasi!`
          );
        } else {
          client.sendMessage(msg.from, `Failed! ${newNum} Sudah Teregistrasi!`);
        }
      } else if (msg.body.match(/#reset/gi)) {
        if (fs.existsSync("dataGet.json")) {
          const data = JSON.parse(
            fs.readFileSync("dataGet.json", { encoding: "utf-8" })
          );
          let newData = [];
          data.map((item) => {
            if (item.nomor === msg.body.split(" ")[1]) {
              client.sendMessage(
                msg.from,
                `Sukses! ${item.nomor} Telah Di Reset jumlah Pengambilan NO OTP Menjadi 0!`
              );
              newData.push({ nomor: item.nomor, get: 0 });
            } else {
              newData.push(item);
            }
          });
          fs.writeFileSync("dataGet.json", JSON.stringify(newData));
        }
		} else if (msg.body.match(/gagal/gi)) {
			/* Function Add History Get Data */
      if (fs.existsSync("dataGet.json")) {
        const data = JSON.parse(
          fs.readFileSync("dataGet.json", { encoding: "utf-8" })
        );
        let newData = [];
        data.map((item) => {
          if (item.nomor === chat.id.user) {
            newData.push({ nomor: chat.id.user, get: item.get - 1 });
          } else {
            newData.push(item);
          }
        });
        fs.writeFileSync("dataGet.json", JSON.stringify(newData));
      } else {
        let newData = [];
        number.map((item) => {
          if (item !== "") {
            newData.push({ nomor: item, get: 0 });
          }
        });
        fs.writeFileSync("dataGet.json", JSON.stringify(newData));
      }
        client.sendMessage(msg.from,`======>>> OtP gak masuk ATau Sudah Terdaftar???`)
		} else if (msg.body.match(/daftar/gi)) {
        client.sendMessage(msg.from,`ganti nomer`)
      } else {
        let tipe = msg.body;
        tipe = tipe.match(/\*/g) ? tipe.replace(/\*/g, "") : tipe;
        tipe = tipe[0].toUpperCase() + tipe.slice(1).toLowerCase();
        if (fs.existsSync(`./Data${tipe}.txt`)) {
			/* Function Add History Get Data */
      if (fs.existsSync("dataGet.json")) {
        const data = JSON.parse(
          fs.readFileSync("dataGet.json", { encoding: "utf-8" })
        );
        let newData = [];
        data.map((item) => {
          if (item.nomor === chat.id.user) {
            newData.push({ nomor: chat.id.user, get: item.get + 1 });
          } else {
            newData.push(item);
          }
        });
        fs.writeFileSync("dataGet.json", JSON.stringify(newData));
      } else {
        let newData = [];
        number.map((item) => {
          if (item !== "") {
            newData.push({ nomor: item, get: 0 });
          }
        });
        fs.writeFileSync("dataGet.json", JSON.stringify(newData));
      }
          if (fs.existsSync(`./state${tipe}.txt`)) {
            index = fs.readFileSync(`./state${tipe}.txt`);
            index = parseInt(index);
          } else {
            index = 0;
          }
          let data = fs.readFileSync(`./Data${tipe}.txt`);
          data = data.toString().split("\n");
          client.sendMessage(msg.from, data[index]);
          index += 1;
          fs.writeFileSync(`./state${tipe}.txt`, `${index}`);
        }
      }
    }
  }
});
client.on('message', async(msg) => {
    let chat = await msg.getChat()
    let panjangPesan = msg.body.split(" ").length
    if (panjangPesan === 1 && !chat.isGroup) {
    if (msg.body.match(/qr/gi)) {
        const media = MessageMedia.fromFilePath('./qrBOT.jpeg');
        client.sendMessage(msg.from,media);
    } else if (msg.body.match(/info/gi)) {
        client.sendMessage(msg.from,`Apk/web

NETFLIX
SHOPE
MICHAT
BL
GOOGLE
AZURE
DANA
VOTE
M3
GOJEK
TELEGRAM
TOKOPEDIA
LAZADA
ALFAGIFT
BLUEMART
Wa
LINE
==> ketik kata yang dicetak Tebal pakai huruf besar semua`)
    } else if (msg.body.match(/done/gi)) {
        client.sendMessage(msg.from,`======>>> Silahkan kirim 
1.DANA 081217792177 a/n Herni Herawati
2.OVO,GOPAY 085330000097 a/n Mohammad Setiyawan
======>>> Silahkan kirim screenshot pembayaran wa.me/6285330000097`)
    } else if (msg.body.match(/rek/gi)) {
        client.sendMessage(msg.from,`nomer rekening
1. bri 593701027425532
a/n mohammad setiyawan
======>>> Silahkan kirim screenshot pembayaran wa.me/6285330000097`)
    } else if (msg.body.match(/virtual/gi)) {
        client.sendMessage(msg.from,`No virtual
1. 39358085330000097 bca ovo
2. 70001085330000097 bca gopay
3. 

atas nama mohammad setiyawan
======>>> Silahkan kirim screenshot pembayaran wa.me/6285330000097`)
	} else if (msg.body.match(/wallet/gi)) {
        client.sendMessage(msg.from,`wallet
!.Doge DBdy9k8ZFnZatwqta3u2cmWyNQFR3XDxDt

======>>> Silahkan kirim screenshot pembayaran wa.me/6285330000097`)
    }
    }
});
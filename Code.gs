function doPost(e) {
  // Buka sheet
  let sheetUrl = "YOUR_SHEET_URL";
  let file = SpreadsheetApp.openByUrl(sheetUrl);
  let sheet = file.getSheetByName("YOUR_SHEET_NAME");

  // Rapikan data
  let req = JSON.stringify(e).replace(/\\/g, "").replace("}\"", "}").replace("\"{", "{");
  let reqJson = JSON.parse(req);
  let senderMessage = JSON.stringify(reqJson["postData"]["contents"]["senderMessage"]);

  //Menguraikan isi Pesan // [Lapor # Masuk # Air Putih # 1 # 2500 ]
  let parsedMassage = senderMessage.split("#");
  let tipe = parsedMassage[1].trim();
  let barang = parsedMassage[2].trim();
  let jumlah = parsedMassage[3].trim();
  let harga = parsedMassage[4].trim().slice(0, -1);

  // Membuat tanggal Masuk
  let row = sheet.getLastRow() + 1;
  let tanggal = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy");

  // menghitung sisa saldo
  let saldo = sheet.getRange(`F${sheet.getLastRow()}`).getValue();
  function hitungSaldo(tipe){
    if(tipe.toLocaleLowerCase() == 'masuk'){
      return Number(saldo) + Number(harga);
    } else {
      return Number(saldo) - Number(harga);
    }
  }

  // insert data
  sheet.getRange(`A${row}`).setValue(tanggal);
  sheet.getRange(`B${row}`).setValue(tipe).setBackground(tipe.toLocaleLowerCase() == 'masuk' ? '#bada55' : 'red');
  sheet.getRange(`C${row}`).setValue(barang);
  sheet.getRange(`D${row}`).setValue(jumlah);
  sheet.getRange(`E${row}`).setValue(harga);
  sheet.getRange(`F${row}`).setValue(hitungSaldo(tipe));

  

  // Response
  let response = {
    data: [
      {
        message: `Terima kasih, data berhasil di input pada tanggal ${tanggal}, Saldo Anda Sisa Rp${hitungSaldo(tipe)}`
      }
    ]
  };

  return ContentService.createTextOutput(JSON.stringify(response));
}


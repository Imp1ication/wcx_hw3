function validateInput() {
  var downloadButtonContainer = document.getElementById("buttonContainer");
  var downloadButtons =
    downloadButtonContainer.querySelectorAll(".download-button");

  downloadButtons.forEach(function (button) {
    button.remove();
  });

  // 檢查除description外的所有字段是否爲空
  const requiredFields = [
    { id: "title", label: "作品名稱" },
    { id: "releaseDate", label: "首播日期" },
    { id: "ageRating", label: "分級" },
    { id: "authors", label: "原著作者" },
    { id: "director", label: "導演監督" },
    { id: "studio", label: "製作廠商" },
    { id: "genres", label: "作品類型" },
  ];

  const emptyField = requiredFields.find(
    (field) => document.getElementById(field.id).value.trim() === "",
  );

  if (emptyField) {
    alert(`請填寫${emptyField.label}欄位！`);
    return false;
  }

  // 獲取表單中的值
  var releaseDate = document.getElementById("releaseDate").value;
  var ageRating = document.getElementById("ageRating").value;

  // 使用正則表達式檢查 releaseDate 格式
  var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(releaseDate)) {
    alert("首播日期格式不正確！請使用YYYY-MM-DD格式。");
    return false;
  }

  // 檢查 ageRating
  var validAgeRatings = ["限制級", "輔導級", "保護級", "普遍級"];
  if (!validAgeRatings.includes(ageRating)) {
    alert("分級不正確！請從提供的選項中選擇一個。");
    return false;
  }

  generateXML();
}

function generateXML() {
  // 读取XML模板
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // 解析XML
      var xmlDoc = this.responseXML;

      // 获取表单中的值
      var title = document.getElementById("title").value;
      var releaseDate = document.getElementById("releaseDate").value;
      var ageRating = document.getElementById("ageRating").value;
      var authors = document.getElementById("authors").value.split(",");
      var director = document.getElementById("director").value;
      var studio = document.getElementById("studio").value;
      var genres = document.getElementById("genres").value.split(",");
      var description = document.getElementById("description").value;

      // 填充XML模板
      xmlDoc.querySelector("anime").setAttribute("ageRating", ageRating);
      xmlDoc.querySelector("title").textContent = title;
      xmlDoc.querySelector("releaseDate").textContent = releaseDate;

      // 清空authors和genres，然后重新填充
      var authorsElement = xmlDoc.querySelector("authors");
      authorsElement.innerHTML = "";
      authors.forEach(function (author) {
        var authorElement = xmlDoc.createElement("author");
        authorElement.textContent = author.trim();
        authorsElement.appendChild(authorElement);
      });

      xmlDoc.querySelector("director").textContent = director;
      xmlDoc.querySelector("studio").textContent = studio;

      var genresElement = xmlDoc.querySelector("genres");
      genresElement.innerHTML = "";
      genres.forEach(function (genre) {
        var genreElement = xmlDoc.createElement("genre");
        genreElement.textContent = genre.trim();
        genresElement.appendChild(genreElement);
      });

      xmlDoc.querySelector("description").textContent = description;

      // 生成XML字符串
      var xmlString = new XMLSerializer().serializeToString(xmlDoc);

      // 建立Blob並提供下載連結
      var blob = new Blob([xmlString], { type: "text/xml" });

      var downloadButtonContainer = document.getElementById("buttonContainer");

      // 建立XML下載按鈕
      var downloadButton = document.createElement("button");
      downloadButton.textContent = "下載 XML";
      downloadButton.className = "download-button";
      downloadButton.onclick = function () {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "generated.xml";
        link.click();
      };

      downloadButtonContainer.appendChild(downloadButton);
    }
  };

  xhttp.open("GET", "anime_template.xml", true);
  xhttp.send();
}

 
const moment = require("moment");

const Assistant = {
  generateSlug: (data) => {
    let slug = data
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    return slug;
  },
  getDaysDiff: (start_date, end_date, date_format = "YYYY-MM-DD") => {
    const getDateAsArray = (date) => {
      return moment(date.split(/\D+/), date_format);
    };
    return (
      getDateAsArray(end_date).diff(getDateAsArray(start_date), "days") + 1
    );
  },
  getYear: (date) => {
    return moment(date).format("YYYY");
  },

  useDate: () => {
    const today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    return today.getFullYear() + "/" + mm + "/" + dd;
  },

  formatCurrency: (value) => {
    return value.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  },
   exportPdf:(data, columns, filename=new Date().now) => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(columns, data);
        doc.save(`${filename}.pdf`);
      });
    });
  },
   exportExcel: (data, fileName="report") => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      Assistant.saveAsExcelFile(excelBuffer, fileName);
    });
  },
   saveAsExcelFile: (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  },
};

module.exports = Assistant;

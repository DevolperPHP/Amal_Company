const moment = require('moment');
const Product = require('../models/Product')

const getIndividualData = async (number) => {
    const monthsArr =
      number === "current_month" ? [moment().format("M/YYYY")] : [];
    for (let i = 1; i <= number; i++) {
      monthsArr.push(moment().subtract(i, "months").format("M/YYYY"));
    }
    console.log(monthsArr)
  
    const products = [];
    let totalSales = 0;
    for (let x = 0; x < monthsArr.length; x++) {
      const currentProducts = await Product.find({
        analysis_date: { $eq: monthsArr[x] },
        score: { $gt: 0 },
      });
      console.log(currentProducts)
      for (let y = 0; y < currentProducts.length; y++)
        totalSales += currentProducts[y].score;
      products.push(...currentProducts);
    }
    return { products, totalSales };
  };

  const getLastMonthsData = async (months) => {
    const monthsArr =
      months === "current-month"
        ? [moment().format("M/YYYY")]
        : [];
    for (let i = 1; i <= months; i++) {
      const month = moment().subtract(i, "months").format("M/YYYY");
      monthsArr.push(month);
    }
    const data = [];
    let totalSales = 0;
    for (let y = 0; y < monthsArr.length; y++) {
      let total = 0;
      let currentMonth = monthsArr[y];
      const products = await Product.find({
        analysis_date: { $eq: currentMonth },
        score: { $gt: 0 },
      });
      for (let x = 0; x < products.length; x++) total += products[x].score;
      data.push(total);
      totalSales += total;
      total = 0;
    }
    return { labels: monthsArr, data, totalSales };
  };

  module.exports = { getIndividualData , getLastMonthsData }
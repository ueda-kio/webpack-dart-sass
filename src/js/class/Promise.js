const fetchFunc = async (keyword) => {
  const response = await fetch(`https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=1036494557627078143&keyword=${keyword}&hits=20`);

  const json = await response.json();
  const status = await response.status;
  const items = json.Items;

  if(status !== 200) {
    console.error(new Error())
  } else if(items.length <= 0) {
    console.log('Not Found');
  } else {
    console.log(items);
  }
}

export default fetchFunc
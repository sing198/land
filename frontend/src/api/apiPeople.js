import axios from 'axios'

const prefix_url = 'http://localhost:3000/people/prefix';
const people_search_url = 'http://localhost:3000/people/search';

// getPrefix
export const fetchPrefix = async () => {
  try {
    const response = await axios.get(prefix_url)
    // console.log('res-prefix:', response.data)
    const prefixList = []
    for (let d of response.data) {
      // console.log(d)
      prefixList.push({
        value: d.prefix_id,
        label: d.prefix_name
      })
    }
    return prefixList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

// Search Like for citizen
export const fetchPeopleName = async (firstName) => {
  const citizen = firstName;
  console.log('citizen:', citizen);
  try {
    console.log('link:',people_search_url+`?firstname="${citizen}"`);
    const response = await axios.get(people_search_url+`?firstname="${citizen}"`);
    console.log('res-citizen:', response.data);
    const citizenNameList = [];
    for (let d of response.data) {
      // console.log(d)
      // citizenNameList.push(d.first_name +' '+ d.last_name)
      citizenNameList.push({
        value: d.ID_CARD,
        label: d.first_name +' '+ d.last_name
      });
    }
    console.log('sss:',citizenNameList)
    return citizenNameList;
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

import React, { useEffect,useState } from 'react';
import axios from 'axios';

export const useFetchAPI = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiURL = process.env.REACT_APP_API || 'http://localhost:5000';
  

  const fetchData = async (param) => {
    console.log('params:', param);
    setLoading(true);
    try{  
      const response = await axios({
          url: `${apiURL}${param.url}`,
          data: param.data,
          method: param.method || 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
      })
      return response;
    }catch(e){
      setError(e.message);
      console.log('e.message :',e.message);
    }finally{
      setLoading(false);
    }
  }

  return {data, loading, fetchData};
}

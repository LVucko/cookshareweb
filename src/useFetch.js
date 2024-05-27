import {useState, useEffect} from 'react';

const useFetch = (url) =>{
    const [data, setData] = useState(null);
    const [isPending, setIsPending] =useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        const abortCont = new AbortController();
        fetch(url, {signal : abortCont.signal})
        .then(res => {
            console.log(res);
            if (!res.ok){
                throw Error('Unable to fetch data from that resource');
            }
            return res.json();
        })
        .then(data => {
            setIsPending(false);
            setData(data);
            setError(null);
        })
        .catch((err) =>{
            if(err.name === 'AbortError'){
                console.log(err)
            }
            setIsPending(false);
            setError(err.message);
        })
        return() => abortCont.abort();
    }, [url]);
    return {data, isPending, error}

}

export default useFetch;
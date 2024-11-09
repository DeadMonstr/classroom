import React, {useCallback, useEffect, useRef, useState} from "react";
import {useHttp} from "hooks/http.hook";
import cls from "components/presentation/ui/imageModal/gifs/gifs.module.sass";


import Input from "components/ui/form/input";
import Loader from "components/ui/loader/Loader";

const useDetectScrolledToBottom = (node) => {
    const [isBottom, setIsBottom] = useState(false);


    const handleScroll = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = node.current;
        if (scrollTop + clientHeight === scrollHeight) {
            setIsBottom(true);
        } else {
            setIsBottom(false);
        }
    }, [node]);



    useEffect(() => {
        if (node.current) {
            node.current.addEventListener("scroll", handleScroll,true);
            return () => node.current?.removeEventListener("scroll", handleScroll,true);
        }
    }, [node, handleScroll]);


    return { isBottom };
};

const Gifs = ({setImage}) => {


    const [gifs,setGifs] = useState([])
    const [offset,setOffset] = useState(0)
    const [loading,setLoading] = useState(false)
    const [search,setSearch] = useState(null)

    const listRef = useRef()

    const {request} = useHttp()

    const api_key = "api_key=cKGsrfVAOqL8ZOvDOhGBYmYMzF9t5MpM"
    const rating = "rating=r"
    const offsetGif = `offset=${offset}`
    const limit = `limit=25`

    useEffect(() => {

        setLoading(true)
        if (!search || !search.length) {

            request(`https://api.giphy.com/v1/gifs/trending?${api_key}&${rating}&${offsetGif}&${limit}`)
                .then(res => {
                    setLoading(false)
                    setGifs(prev => [...prev,...res.data])
                })
        }



    }, [offset,search])


    const {isBottom} = useDetectScrolledToBottom(listRef)

    useEffect(() => {
        if (isBottom) {
            setOffset(prev => prev + 25)
        }
    },[isBottom])




    useEffect(() => {
        if ( search && search.length) {
            request(`https://api.giphy.com/v1/gifs/search?${api_key}&q=${search}&${rating}&${offsetGif}&${limit}`)
                .then(res => {
                    setLoading(false)
                    setGifs(prev => [...prev, ...res.data])
                })
        }
    },[search,offset])



    const onChangeSearch = (e) => {
        setOffset(0)
        setGifs([])
        setSearch(e)
    }


    async function gifUrlToBlob(gifUrl) {
        try {
            // Fetch the GIF from the URL
            const response = await fetch(gifUrl);

            // Ensure the fetch was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Convert the response to a Blob
            return await response.blob();
        } catch (error) {
            console.error('Error converting GIF URL to Blob:', error);
            throw error;
        }
    }

    const onClickGif = async (item) => {


        const blob = await gifUrlToBlob(item.url)


        setImage(blob)
    }

    return (
        <div className={cls.gifs}>

            <div className={cls.header}>

                <Input title={"Search"} value={search} onChange={onChangeSearch}/>

            </div>
            <div className={cls.list}  ref={listRef}>
                {
                    gifs.map(item => {
                        return (
                            <div onClick={() => onClickGif(item.images.fixed_height)} className={cls.list__item}>
                                <img loading="lazy" src={item.images.fixed_height.url} alt="Gif"/>
                            </div>
                        )
                    })
                }
                {loading && <Loader/>}

            </div>


        </div>
    )
}


export default Gifs
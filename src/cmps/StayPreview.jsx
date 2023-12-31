import { utilService } from "../services/util.service";
import { useState } from "react"
import { useNavigate } from "react-router";
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
import heart1ImgUrl from '../assets/img/heart1.png'
import heart2ImgUrl from '../assets/img/heart2.png'

export function StayPreview({ stay, onLike, loggedinUser }) {
    const navigate = useNavigate()
    const [selectedImg, setSelectedImg] = useState(0)
    const [imageLoaded, setImageLoaded] = useState(false);
    const { imgUrls, name, loc, price, reviews } = stay

    function incImg(inc) {
        if (selectedImg <= 0 && inc < 0) return
        if (selectedImg >= imgUrls.length - 1 && inc > 0) return
        setSelectedImg(prev => prev + inc)
    }

    function onStay(stayId) {
        navigate(`/stay/${stayId}`)
    }

    function whichHeart() {
        if (!loggedinUser) return heart1ImgUrl
        const likeIndx = stay.likedByUsers.findIndex((user) => user._id === loggedinUser._id)
        return (likeIndx >= 0) ? heart2ImgUrl : heart1ImgUrl
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const { rating } = utilService.mapRating(reviews)
    return (
        <section className="stay-prev" onClick={() => onStay(stay._id)}>
            <section className="img-sec">
                <img
                    src={imgUrls[selectedImg]}
                    className={`stay-img ${imageLoaded ? '' : 'loading'}`}
                    onLoad={handleImageLoad} />
                <img src={whichHeart()} className="heart" onClick={(ev) => { ev.stopPropagation(); onLike(stay) }} />
                <article className="img-dots flex">
                    {imgUrls.map((img, i) =>
                        <div className={`dot ${i === selectedImg ? "select" : ""}`} key={i}></div>
                    )}
                </article>
                <article className="img-arrow flex space-between">
                    <KeyboardArrowLeftSharpIcon className={`arrow left ${selectedImg <= 0 ? "hide" : ""} `} onClick={(ev) => { ev.stopPropagation(); incImg(-1) }} />
                    <KeyboardArrowRightSharpIcon className={`arrow right ${selectedImg >= imgUrls.length - 1 ? "hide" : ""} `} onClick={(ev) => { ev.stopPropagation(); incImg(1) }} />
                </article>
            </section>


            <article className={`text-sec ${imageLoaded ? '' : 'text-loading'}`}>
                <article className="flex space-between">
                    <p className={`name`}>{name}</p>
                    <div className=" rating flex align-center">
                        <StarIcon className="star-icon" />
                        <p>{rating.value ? rating.value.toFixed(2) : 5}</p>
                    </div>
                </article>
                <div>
                    <p className="loc">{loc.city}, {loc.country}</p>
                </div>
                <div>
                    <p className="price">₪{price} <span>night</span></p>
                </div>
            </article>
        </section>
    )
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { stayService } from "../services/stay.service";

import { StayHeader } from "../cmps/StayHeader";
import { Reviews } from "../cmps/reviews";
import { StayReviewDetail } from "../cmps/StayReviewDetail";
import { OrderForm } from "../cmps/OrderForm";
import { StayMap } from "../cmps/StayMap";
import { HostStay } from "../cmps/HostStay";

import StarIcon from '@mui/icons-material/Star';
import { SingInUp } from "../cmps/SingInUp";
import { useSelector } from "react-redux";
import { orderService } from "../services/order.service";
import { addOrder } from "../store/actions/order.actions";
import { utilService } from "../services/util.service";
import { StayImgHeader } from "../cmps/StayImgHeader";

export function StayDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const loggedinUser = useSelector((storeState) => storeState.userModule.user)
    const [filter, setFilter] = useState({ label: 'Amazing views', destinations: "", checkIn: null, checkOut: null, guests: { adults: 0, children: 0, infants: 0 } });
    const [searchStay, setSearchStay] = useState({})
    const [isLog, setIsLog] = useState(false)
    const [currStay, setCurrStay] = useState()
    const { checkIn, checkOut } = searchStay


    useEffect(() => {
        const { stayId } = params
        getStay(stayId)
            .catch((err) => {
                console.log(err)
            })
    }, [])

    async function getStay(stayId) {
        try {
            const stay = await stayService.get(stayId)
            if (!stay) return navigate("/stay");
            setCurrStay(stay);
            const { checkIn, checkOut } = utilService.findConsecutiveAvailableDates(stay.DateNotAvailable)
            setSearchStay({ checkIn, checkOut, guests: { adults: stay.capacity.guests, children: 0, infants: 0 } })
        } catch (error) {
            console.log("Had issues loading stay", error);
        }
    }

    async function onContactHost() {
        const miniStay = { _id, name, price, imgUrl: imgUrls[0] }
        const order = orderService.getEmptyOrder({ host, loggedinUser, totalPrice: null, checkIn: null, checkOut: null, guests: { adults: 0, children: 0, infants: 0 }, miniStay, status: 'negotiations' })
        try {
            const saveOrder = await addOrder(order)
            navigate(`/messages?orderId=${saveOrder._id}`)
        } catch (error) {
            console.log("Had issues create a order", error);
        }
    }

    if (!currStay || currStay.length === 0) return (<div>loading...</div>)
    const { _id, imgUrls, name, host, price, reviews, loc } = currStay
    const { rating, ratingName } = utilService.mapRating(reviews)
    return (
        <section className="stay-details main-container">
            <StayHeader isDetails={true} setIsLog={setIsLog} filter={filter} setFilter={setFilter} />
            <StayImgHeader stay={currStay} rating={rating} />
            <main>
                <StayReviewDetail currStay={currStay} setDates={setSearchStay} checkIn={checkIn} checkOut={checkOut} />
                <OrderForm searchStay={searchStay} setSearchStay={setSearchStay} currStay={currStay} rating={rating.value} reviews={reviews.length} />
            </main>

            <Reviews reviews={reviews} rating={rating} ratingName={ratingName} />
            <article className="map-sec">
                <h2>Where you’ll be</h2>
                <StayMap loc={loc} />
                <h3>{loc.address}, {loc.city}, {loc.country}</h3>
                <p>Very quiet and pleasant neighborhood</p>
            </article>
            <HostStay currStay={currStay} onContactHost={onContactHost} />

            {isLog && <SingInUp operation={isLog} closeLog={closeLog} />}

        </section>
    )
}
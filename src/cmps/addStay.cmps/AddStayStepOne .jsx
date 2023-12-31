import imgUrl from '../../assets/img/home.png'

export function AddStayStepOne({ isExistsStay, onDelete}) {
    return (
        <section className="add-stay-step-one flex align-center ">
            <article>
                <h4>Step 1</h4>
                <h2>{`${isExistsStay ? 'Update the data of your place' : 'Tell us about your place'}`}</h2>
                <p>In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.</p>
                {isExistsStay && <button className='delete black-btn' onClick={onDelete}>Delete place</button>}
            </article>
            <img src={imgUrl} />
        </section>
    )
}
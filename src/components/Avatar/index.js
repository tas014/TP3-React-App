import React from 'react'
//genero un JSX con la imagen de faker como parametro y el nombre como alt
const Avatar = props => {
    const {name,imageSrc}=props
    return(
        <figure className='image is-64x64'>
            <img alt={name} className='is-rounded' src={imageSrc} />
        </figure>
    )
}

export default Avatar
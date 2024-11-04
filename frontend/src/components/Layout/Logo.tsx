import logo from '../../assets/images/logo.png';

const Logo = () => {
    return (
        <div id='logo-container' className='flex items-center'>
            <img src={logo} alt="Logo" id='logo' className='h-10 w-auto' />
            <h1 id='company-name' className='text-2xl mx-1'> Bank </h1>
        </div>
    );
};

export default Logo;
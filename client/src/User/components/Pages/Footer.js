import React from 'react';
import "../../styles/pages/footer.css"; 

const Footer = () => {
    return (
        <footer className="flex flex-col items-center px-4 py-8 bg-white">
            <div className="w-full flex justify-center">
                <ul className="flex flex-wrap justify-center list-none p-0 m-0">
                    <li className="mr-5 text-[#603830] text-base last:mr-0 mb-2 sm:mb-0">Home</li>
                    <li className="mr-5 text-[#603830] text-base last:mr-0 mb-2 sm:mb-0">About</li>
                    <li className="mr-5 text-[#603830] text-base last:mr-0 mb-2 sm:mb-0">Service</li>
                    <li className="mr-5 text-[#603830] text-base last:mr-0 mb-2 sm:mb-0">Articles</li>
                    <li className="text-[#603830] text-base mb-2 sm:mb-0">Contact</li>
                </ul>
            </div>
            <hr className="w-full border-t border-[#e39fa9] my-5" />
            <div className="text-xs text-[#603830] text-center">
                <p className="m-0">&copy; 2024 MatriCare All rights reserved</p>
            </div>
        </footer>
    );
}

export default Footer;

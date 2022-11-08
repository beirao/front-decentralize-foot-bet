import { useEffect, useState } from "react"
import { BiArrowFromBottom } from "react-icons/bi"

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility)

        return () => {
            window.removeEventListener("scroll", toggleVisibility)
        }
    }, [])

    return (
        <div className="fixed bottom-16 right-6">
            {isVisible ? (
                <button
                    type="button"
                    onClick={scrollToTop}
                    className={
                        "opacity-75 bg-sky-600 hover:bg-pink-700 inline-flex items-center rounded-full p-3 text-white shadow-sm transition-opacity focus:outline-none"
                    }
                >
                    <BiArrowFromBottom className="h-6 w-6" aria-hidden="true" />
                </button>
            ) : (
                ""
            )}
        </div>
    )
}

export default ScrollToTop

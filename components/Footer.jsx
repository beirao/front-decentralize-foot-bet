export default function Header() {
    return (
        <footer className="fixed bottom-0 left-0 p-2 md:p-4 w-full bg-white border-t border-gray-200 shadow flex items-center justify-between dark:bg-gray-800 dark:border-gray-600">
            <span className="md:text-sm text-xs text-gray-500 sm:text-center dark:text-gray-400">
                2022 BoarBet on Goerli - Thomas MARQUES
            </span>
            <ul className="flex flex-wrap items-center md:text-sm text-xs text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a
                        href="https://choosealicense.com/licenses/mit/"
                        target="_blank"
                        rel="noreferrer"
                        className="mr-3 hover:underline lg:mr-10"
                    >
                        Licensing
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/beirao"
                        target="_blank"
                        rel="noreferrer"
                        className="mr-3 hover:underline lg:mr-10"
                    >
                        Github
                    </a>
                </li>

                <li>
                    <a
                        href="https://linkedin.com/in/marquesth"
                        target="_blank"
                        rel="noreferrer"
                        className="mr-3 hover:underline lg:mr-10"
                    >
                        Linkedin
                    </a>
                </li>
                <li>
                    <a
                        href="https://cv.beirao.me"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline mr-2 lg:mr-10"
                    >
                        CV
                    </a>
                </li>
            </ul>
        </footer>
    )
}

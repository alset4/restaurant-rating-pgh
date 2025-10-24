import Image from "next/image";

export default function AboutCard() {
    return (
        <section className="mb-16">
            <h1 className="text-4xl font-bold mb-6 text-center text-black">About</h1>
            <div className="rounded-lg p-8 shadow-md bg-white">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4 items-center">
                        <video
                            className="rounded-lg shadow-lg w-[400px] h-[400px] aspect-square object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/hero.mp4" type="video/mp4" />
                        </video>
                        <h2 className="text-4xl font-bold mb-6 text-center text-black mt-4">Abstract</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Our mission is to do a breadth first search of all the restaurants in the Pittsburgh area and rank them based on their attributes. We are starting at 250 Atwood Street and moving radially outward until we reach the outskirts of the city proper.
                        </p>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-4xl font-bold mb-6 text-center text-black">Mission</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                        We are a group of three roommates who are passionate food connoisseurs and want to get to the bottom of what the best restaurant is in the Oakland neighborhood, and past that, the overall Pittsburgh Greater Area.
                        </p>
                        <Image
                            src="/hero.png"
                            alt="About us"
                            width={400}
                            height={400}
                            className="rounded-lg w-[400px] h-[400px] aspect-square object-cover mt-4 text-center"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
import { MotionDiv } from "@/components/motion";
import { Microphone } from "@/components/ui/Mic";
import { Pen } from "@/components/ui/Pen";
import { formatDistance } from "date-fns";
import React from "react";

const TALKS = [
    {
        talk: "How People with Disability Access the Web",
        date: "2023-10-26",
        event: "Google DevFest Student's Edition",
        location: "Nairobi, Kenya",
    },
    {
        talk: "Building End-to-End Typesafe APIs with tRPC",
        date: "2023-11-11",
        event: "CityJS Conference",
        location: "Lagos, Nigeria",
    },
];

const childVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TalksPage() {
    return (
        <MotionDiv variants={childVariants}>
            <div>
                <span className="text-xl flex gap-2 items-center my-6 cursor-pointer">
                    <Microphone size={19} />
                    Talks
                </span>

                {TALKS.map((talk, index) => (
                    <div key={index} className="mb-8">
                        <div className="flex justify-between items-start">
                            <h2 className="text-lg  decoration-grey-100 hover:decoration-1 mb-1">{talk.talk}</h2>
                            <span className="text-sm">
                                {formatDistance(new Date(talk.date), new Date(), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                        {talk.location && (
                            <div className="flex gap-2">
                                <p className="text-sm text-grey-400">
                                    {talk.event} ({talk.location})
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </MotionDiv>
    );
}

import EventDescription from "./EventDescription";
import Location from "./Location";
import YouMayLikeWrapper from "./YouMayLikeWrapper";

const ContentItem = ({ data, slug }) => {
    return (
        <div className="event-item__content" data-event-item-content="">
            <EventDescription data={data} slug={slug} />
            <Location data={data} />
            <YouMayLikeWrapper data={data} />
        </div>
    )
}

export default ContentItem;
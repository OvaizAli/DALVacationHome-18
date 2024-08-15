import axios from "axios";

export const getBookingByUser = async (user) => {
try {
const endpoint = 'https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/'  ;
const response = await axios.get('https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/booking');
console.log("Booking API Service data:",response)
console.log("User data:",user)
const bookingData = response.data.Items;
    // propertyId: approval.propertyId?.S || '',
    // roomNumber: approval.roomNumber?.N || -1 ,
    // fromDate: approval.fromDate?.S || '',
    // toDate: approval.toDate?.S || '',
    // isApproved: approval.isApproved?.N || -1,
    // agentId: approval.agentId?.S || '',
    // creationDate: approval.creationDate?.S || ''
    const transformedBooking = bookingData.filter(booking => booking.userId?.S === user.email).map(booking => ({
    bookingReferenceNumber: booking.bookingReferenceNumber?.S || '',
    userId: booking.userId?.S || ''
}));
    return transformedBooking;
}
catch(error){
    console.log("Something went wrong while fetching booking data:",error);
    return null;
}
}
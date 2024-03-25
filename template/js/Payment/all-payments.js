async function fetchFormattedPayments() {
    try {
        const response = await fetch('https://localhost:7177/api/payments/get-all-payments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch payments');
        }

        const paymentsData = await response.json();
        const formattedPayments = paymentsData.map(item => ({
            Id: item.Id,
            StudentId: item.student.id,
            GroupId: item.student.guruh.id,
            Paid: item.qanchaTolagan,
            WhenPaid: formatDateTime(item.qachonTolagan), 
        }));
        return formattedPayments;
    } catch (error) {
        console.error('Error fetching and formatting payments:', error);
        return null;
    }
}
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Tashkent',
    };
    return dateTime.toLocaleString('uz-UZ', options);
}
async function displayFormattedPayments() {
    const formattedPayments = await fetchFormattedPayments();
    if (formattedPayments) {
        const table = $('#payments').DataTable({
            destroy: true, 
        });

        formattedPayments.forEach(payment => {
            table.row.add([
                payment.Id,
                payment.StudentId,
                payment.GroupId,
                payment.Paid,
                payment.WhenPaid
            ]);
        });

        table.draw(); 
    } else {
        console.log('Failed to fetch and format payments');
    }
}
displayFormattedPayments();
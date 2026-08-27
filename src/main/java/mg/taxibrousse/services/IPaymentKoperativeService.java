package mg.taxibrousse.services;

import mg.taxibrousse.models.PaymentKoperative;

public interface IPaymentKoperativeService {

    PaymentKoperative getOrCreatePaymentKoperative(Long voyageId);
}

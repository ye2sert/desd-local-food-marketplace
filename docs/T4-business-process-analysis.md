# T4 – Business Process Analysis

**Project:** Bristol Regional Food Network – Digital Marketplace

**Owner:** Tahmid  
**Sprint:** 1  
**Points:** 3

## Overview

The Bristol Regional Food Network Digital Marketplace allows customers to purchase food products from multiple local producers through a single online platform.

The marketplace manages product availability, customer orders, payments and communication with producers.

## Major Business Processes

### 1. Product Browsing and Selection

**Responsible:** Customer and Marketplace Platform

- Customers browse or search available products.
- Customers select products from different producers.
- Selected products are added to a shopping basket.
- The marketplace calculates the basket total.

### 2. Stock Validation

**Responsible:** Marketplace Platform and Producer

- The customer proceeds to checkout.
- The system checks product availability.
- Requested quantities are compared with available stock.
- Unavailable products prevent checkout from continuing.
- Customers can amend their baskets before trying again.

### 3. Order Creation

**Responsible:** Marketplace Platform

- The customer reviews and confirms the basket.
- The marketplace creates an overall order.
- The order is separated into producer-specific elements.
- Delivery or collection arrangements are identified.

### 4. Payment Processing

**Responsible:** Marketplace Platform and Payment Service

- The customer submits payment.
- The marketplace sends the payment request to the simulated payment service.
- The payment service processes the request.
- Successful payments allow the order to be confirmed.
- Declined payments allow customers to retry.
- Temporary payment-service failures follow an exception or retry process.

### 5. Inventory Updates

**Responsible:** Marketplace Platform

- Inventory quantities are updated after successful payment.
- Purchased quantities are deducted from available stock.
- Products reaching zero stock become unavailable for new orders.

### 6. Producer Notification

**Responsible:** Marketplace Platform and Producer

- Producers receive notifications about confirmed orders.
- Each producer receives information about their own products.
- Producers prepare their part of the order.

### 7. Commission and Producer Settlement

**Responsible:** Marketplace Platform

- The system calculates the amount attributable to each producer.
- The marketplace calculates its 5% commission.
- Producer settlement records are maintained.
- Weekly settlement information is made available for accounting purposes.

## Important Business Rules

1. Stock must be checked when the customer proceeds to checkout.
2. Checkout cannot continue if requested products are unavailable.
3. Inventory must only be updated after successful payment.
4. Customers should be able to retry declined payments.
5. Temporary payment-service failures must be handled.
6. The marketplace calculates a 5% commission on multi-vendor orders.
7. Payment testing must use a sandbox or simulated payment service.

## Conclusion

These business processes explain how the marketplace operates from product selection through payment and order fulfilment.

The analysis supports the strategic BPMN model and provides a foundation for detailed modelling in Sprint 2.

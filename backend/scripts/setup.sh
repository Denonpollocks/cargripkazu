#!/bin/bash

# Create necessary directories
mkdir -p src/templates/email

# Copy email templates if they don't exist
for template in quotation-confirmation quotation-response order-confirmation shipping-update delivery-confirmation; do
  if [ ! -f "src/templates/email/$template.hbs" ]; then
    touch "src/templates/email/$template.hbs"
  fi
done 
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.config import settings

router = APIRouter()

TIMEOUT_SECONDS = 10.0


class ExchangeRateResponse(BaseModel):
    base_currency: str
    target_currency: str
    rate: float
    amount: float
    converted_amount: float


async def _fetch_exchange_rates(base_currency: str) -> dict[str, Any]:
    """Fetch exchange rates from external API."""
    url = f"{settings.EXCHANGE_RATE_API_URL}/{base_currency.upper()}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=TIMEOUT_SECONDS)
        response.raise_for_status()
        return response.json()


@router.get("/rates/{base_currency}")
async def get_exchange_rates(
    base_currency: str = "USD",
) -> dict[str, Any]:
    """
    Get exchange rates for a base currency.
    This integrates with exchangerate-api.com (free tier, no API key required).
    """
    try:
        data = await _fetch_exchange_rates(base_currency)
        return {
            "base": data.get("base", base_currency.upper()),
            "date": data.get("date"),
            "rates": data.get("rates", {}),
        }
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to fetch exchange rates: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service unavailable: {str(e)}",
        )


@router.get("/convert")
async def convert_currency(
    amount: float = Query(..., gt=0, description="Amount to convert"),
    from_currency: str = Query("USD", description="Source currency code"),
    to_currency: str = Query("EUR", description="Target currency code"),
) -> ExchangeRateResponse:
    """
    Convert an amount from one currency to another.
    This demonstrates third-party API integration by converting expense amounts.
    """
    if from_currency.upper() == to_currency.upper():
        return ExchangeRateResponse(
            base_currency=from_currency.upper(),
            target_currency=to_currency.upper(),
            rate=1.0,
            amount=amount,
            converted_amount=round(amount, 2),
        )

    try:
        data = await _fetch_exchange_rates(from_currency)
        rates = data.get("rates", {})
        target_upper = to_currency.upper()

        if target_upper not in rates:
            raise HTTPException(
                status_code=400,
                detail=f"Currency {to_currency} not found in exchange rates",
            )

        rate = float(rates[target_upper])
        converted_amount = round(amount * rate, 2)

        return ExchangeRateResponse(
            base_currency=from_currency.upper(),
            target_currency=target_upper,
            rate=rate,
            amount=amount,
            converted_amount=converted_amount,
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to fetch exchange rates: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service unavailable: {str(e)}",
        )
    except (ValueError, KeyError) as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid response from exchange rate API: {str(e)}",
        )

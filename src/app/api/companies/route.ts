import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateFintechCompanyData } from '@/lib/types'

export async function GET() {
  try {
    const companies = await prisma.fintechCompany.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateFintechCompanyData = await request.json()
    
    const company = await prisma.fintechCompany.create({
      data: body,
      include: {
        products: true,
      },
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}

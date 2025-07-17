'use server';
import { NextResponse } from 'next/server';
import client from '@/lib/gemini';
import { z } from 'zod';

const schema = z.object({
    prompt: z.string({
        invalid_type_error: 'Invalid prompt',
    }),
})

export async function submitRequest(initialState, request) {
    const validatedField = schema.safeParse({
        prompt: request.get('prompt')
    })

    if (!validatedField.success) {
        return { message: "Invalid prompt" }
    }

    const body = validatedField.data

    try {
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: "Provide a short description of a sentiment analysis of the text and extract the most relevant keywords, and ensure the response is formatted as neat markdown without being wrapped in triple backticks.",
            },
            contents: body.prompt,
        });

        return { message: response.text };
    } catch (error) {
        console.error(error)
        return { message: "Failed to generate a response, please try again." };
    }
}
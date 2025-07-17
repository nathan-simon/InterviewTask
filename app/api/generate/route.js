'use server';
import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
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
        const response = await openai.responses.create({
            model: "gpt-4.1",
            instructions: "Provide a sentiment analysis of the text and extract the most relevant keywords, and ensure the response is formatted as markdown without being wrapped in triple backticks.",
            input: body.prompt,
        });

        return { message: response.output_text };
    } catch (error) {
        console.error(error)
        return { message: "Failed to generate a response, please try again." };
    }
}
import React from "react"
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from "../src/components/BlogForm"

const blog = {
    title: "Testing front-end",
    author: "Zoker",
    url: "http://example.com/blos/123",
    likes: 10,
    user: {
        username: "admin"
    }
}

test("submitting blog form", async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm handleCreateBlog={ createBlog} />)
    
    const inputs = screen.getAllByRole('textbox')
    const createButton = screen.getByText('create')

    await user.type(inputs[0], blog.title)
    await user.type(inputs[1], blog.author)
    await user.type(inputs[2], blog.url)
    await user.click(createButton)

    console.log(createButton)
    
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
    expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
    expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
})
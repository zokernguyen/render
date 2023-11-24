import React from "react"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from "../src/components/Blog"

const blog = {
    title: "Testing front-end",
    author: "Zoker",
    url: "http://example.com/blos/123",
    likes: 10,
    user: {
        username: "admin"
    }
}

test('simple blog view by default', () => {

    const container = render(<Blog blog={blog} />).container

    const title = container.querySelector('.title')
    const author = container.querySelector('.author')
    const url = container.querySelector('.url')
    const likes = container.querySelector('.like')

    screen.debug(container)

    expect(title).toHaveTextContent(blog.title)
    expect(author).toHaveTextContent(`- by ${blog.author}`)
    expect(url).toBeNull()
    expect(likes).toBeNull()
})

test('shows blog details when "view" button is clicked', async () => {
    render(<Blog blog={blog} handleRemove={() => { }} handleLike={() => { }} />);

    const viewButton = screen.getByText('view');
    const user = userEvent.setup()
    
    await user.click(viewButton)

    expect(screen.getByText(blog.url)).toBeDefined();
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined();
    expect(screen.getByText(`${blog.user.username}`)).toBeDefined();
})

test.only('clicking like button twice', async () => {
    const mockLike = jest.fn()
    render(<Blog blog={blog} handleRemove={() => { }} handleLike={mockLike} />)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
})
// src/TodoSearch.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const TodoSearch = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTodos(response.data);
      setFilteredTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const searchSchema = Yup.object().shape({
    query: Yup.string().required("Search query is required"),
  });

  const handleSearch = (values, { setSubmitting }) => {
    const { query } = values;
    const results = todos.filter((todo) =>
      todo.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredTodos(results);
    setSubmitting(false);
  };

  return (
    <div>
      <h1>Todo Search</h1>

      <Formik
        initialValues={{ query: "" }}
        validationSchema={searchSchema}
        onSubmit={handleSearch}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="query" placeholder="Search todos..." />
            <button type="submit" disabled={isSubmitting}>
              Search
            </button>
            <ErrorMessage
              name="query"
              component="div"
              style={{ color: "red" }}
            />
          </Form>
        )}
      </Formik>

      <div>
        {filteredTodos.length > 0 ? (
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <span>{todo.title}</span> -{" "}
                <span>{todo.completed ? "Completed" : "Pending"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default TodoSearch;

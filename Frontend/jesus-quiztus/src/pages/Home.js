import React, { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import { useUser } from "../context/UserContext";
import Navigation from "../components/Navigation";

export default function Home() {
  const { session } = useUser();

  if (!session) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <Navigation />
    </div>
  );
}
